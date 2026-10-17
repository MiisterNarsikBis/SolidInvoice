<?php

declare(strict_types=1);

/*
 * This file is part of SolidInvoice project.
 *
 * (c) Pierre du Plessis <open-source@solidworx.co>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace SolidInvoice\InstallBundle\Installer\Database;

use Carbon\CarbonImmutable;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Metadata\Storage\TableMetadataStorageConfiguration;
use Doctrine\Migrations\Version\ExecutionResult;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\SqlFormatter\SqlFormatter;
use Generator;
use Psr\Cache\CacheItemPoolInterface;

final readonly class Migration
{
    private SqlFormatter $sqlFormatter;

    public function __construct(
        private DependencyFactory $migrationDependencyFactory,
        private ManagerRegistry $registry,
        private CacheItemPoolInterface $cache,
    ) {
        $this->sqlFormatter = new SqlFormatter();
    }

    /**
     * Asked on every request, and answering it costs a couple of dozen queries (the migration
     * table, then the schema introspection behind it). "Up to date" is therefore remembered for a
     * few minutes, keyed by the list of migrations the code ships: a new migration file changes
     * the key, so an upgrade is noticed at once. Only a positive answer is kept, so a database
     * that is behind is checked again on the next request.
     */
    public function isUpToDate(): bool
    {
        $available = array_map(
            static fn ($migration): string => (string) $migration->getVersion(),
            $this->migrationDependencyFactory->getMigrationRepository()->getMigrations()->getItems(),
        );

        $item = $this->cache->getItem('migrations_up_to_date_' . md5(implode(',', $available)));

        if ($item->isHit()) {
            return true;
        }

        $upToDate = $this->checkUpToDate();

        if ($upToDate) {
            $this->cache->save($item->set(true)->expiresAfter(300));
        }

        return $upToDate;
    }

    private function checkUpToDate(): bool
    {
        $statusCalculator = $this->migrationDependencyFactory->getMigrationStatusCalculator();

        $executedUnavailableMigrations = $statusCalculator->getExecutedUnavailableMigrations();
        $newMigrations = $statusCalculator->getNewMigrations();
        $newMigrationsCount = count($newMigrations);
        $executedUnavailableMigrationsCount = count($executedUnavailableMigrations);

        return $newMigrationsCount === 0 && $executedUnavailableMigrationsCount === 0;
    }

    public function migrate(?callable $callback = null): Generator
    {
        $metadataStorage = $this->migrationDependencyFactory->getMetadataStorage();

        $metadataStorage->ensureInitialized();

        $em = $this->registry->getManager();
        assert($em instanceof EntityManagerInterface);
        $tables = $em->getMetadataFactory()->getAllMetadata();

        $planCalculator = $this->migrationDependencyFactory->getMigrationPlanCalculator();

        $version = $this->migrationDependencyFactory->getVersionAliasResolver()->resolveVersionAlias('latest');

        $plan = $planCalculator->getPlanUntilVersion($version);

        $schemaTool = new SchemaTool($em);
        $conn = $em->getConnection();

        // ORM 3's SchemaTool::getUpdateSchemaSql() no longer has a "save mode" (the
        // boolean second argument was removed in ORM 3), so it now emits DROP TABLE
        // statements for any table present in the database but absent from the ORM
        // metadata. The migrations metadata table (created by ensureInitialized()
        // above) is exactly such a table, so without excluding it the generated SQL
        // would try to drop it. Filter it out of the schema introspection while the
        // update SQL is computed.
        $dbalConfiguration = $conn->getConfiguration();
        $previousFilter = $dbalConfiguration->getSchemaAssetsFilter();
        $migrationsTable = $this->migrationsTableName();

        $dbalConfiguration->setSchemaAssetsFilter(
            static function (string $assetName) use ($previousFilter, $migrationsTable): bool {
                if ($migrationsTable !== null && $assetName === $migrationsTable) {
                    return false;
                }

                return $previousFilter($assetName);
            }
        );

        try {
            $updateSchemaSql = $schemaTool->getUpdateSchemaSql($tables);
        } finally {
            $dbalConfiguration->setSchemaAssetsFilter($previousFilter);
        }

        if ($updateSchemaSql !== []) {
            foreach ($updateSchemaSql as $sql) {
                $conn->executeStatement($sql);

                if (null !== $callback) {
                    yield from $callback($this->sqlFormatter->format($sql));
                }
            }
        } elseif (null !== $callback) {
            yield from $callback('Database schema is already up to date.');
        }

        $now = CarbonImmutable::now();

        foreach ($plan->getItems() as $item) {
            $metadataStorage->complete(new ExecutionResult($item->getVersion(), $item->getDirection(), $now));
        }
    }

    private function migrationsTableName(): ?string
    {
        $storageConfiguration = $this->migrationDependencyFactory->getConfiguration()->getMetadataStorageConfiguration();

        return $storageConfiguration instanceof TableMetadataStorageConfiguration
            ? $storageConfiguration->getTableName()
            : null;
    }
}
