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

namespace SolidInvoice\SettingsBundle\Repository;

use Doctrine\Persistence\ManagerRegistry;
use InvalidArgumentException;
use SolidInvoice\CoreBundle\Company\CompanySelector;
use SolidInvoice\CoreBundle\Entity\Company;
use SolidInvoice\CoreBundle\Repository\CompanyRepository;
use SolidInvoice\SettingsBundle\Entity\Setting;
use SolidWorx\Platform\PlatformBundle\Repository\EntityRepository;
use Throwable;
use function assert;
use function is_array;

/**
 * @extends EntityRepository<Setting>
 */
class SettingsRepository extends EntityRepository
{
    /**
     * Every setting of the current company, by key, loaded by the first lookup of the request.
     * A page asks for dozens of settings (company name, currency, logo, ...); one query each
     * was most of the database traffic of a page. Keyed by company, so switching company
     * inside a process never serves the other company's values.
     *
     * @var array<string, array<string, Setting>>
     */
    private array $loaded = [];

    public function __construct(
        ManagerRegistry $registry,
        private readonly CompanySelector $companySelector,
    ) {
        parent::__construct($registry, Setting::class);
    }

    /**
     * @param array<string, string> $settings
     *
     * @throws InvalidArgumentException|Throwable
     */
    public function store(array $settings): void
    {
        $this->loaded = [];
        $settings = $this->flatten($settings);
        $entityManager = $this->getEntityManager();

        try {
            $entityManager->wrapInTransaction(function () use ($settings): void {
                foreach ($settings as $key => $value) {
                    if ('system/domain/custom_domain' === $key) {
                        $companyRepository = $this->getEntityManager()->getRepository(Company::class);
                        assert($companyRepository instanceof CompanyRepository);
                        $value = $companyRepository->updateCustomDomain(empty($value) ? null : $value);
                    }

                    $this->createQueryBuilder('s')
                        ->update()
                        ->set('s.value', ':val')
                        ->where('s.key = :key')
                        ->setParameter('key', $key)
                        ->setParameter('val', empty($value) ? null : $value)
                        ->getQuery()
                        ->execute();

                    if ('system/company/company_name' === $key) {
                        $this->getEntityManager()->getRepository(Company::class)->updateCompanyName($value);
                    }
                }
            });
        } finally {
            // Detach the entities, to not keep previous setting values
            $unitOfWork = $entityManager->getUnitOfWork();
            $entities = $unitOfWork->getIdentityMap()[Setting::class] ?? [];

            foreach ($entities as $entity) {
                $entityManager->detach($entity);
            }
        }
    }

    public function delete(string $key): void
    {
        $this->loaded = [];
        $setting = $this->findOneBy(['key' => $key]);

        if ($setting === null) {
            return;
        }

        $this->getEntityManager()->remove($setting);
        $this->getEntityManager()->flush();
    }

    /**
     * @param array<string, mixed> $array
     * @return array<string, mixed>
     */
    private function flatten(array $array, string $prefix = ''): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $result = [...$result, ...$this->flatten($value, $prefix . $key . '/')];
            } else {
                $result[$prefix . $key] = $value;
            }
        }

        return $result;
    }

    public function getSetting(string $key, ?Company $company): ?Setting
    {
        if (! $company instanceof Company) {
            $companyId = (string) $this->companySelector->getCompany();

            // Without a company there is nothing to scope but the current one: read them all once.
            if (! isset($this->loaded[$companyId])) {
                $this->loaded[$companyId] = [];

                foreach ($this->findAll() as $setting) {
                    $this->loaded[$companyId][$setting->getKey()] = $setting;
                }
            }

            return $this->loaded[$companyId][$key] ?? null;
        }

        $params = ['key' => $key];

        if ($company instanceof Company) {
            $this->companySelector->reset();
            $params['company'] = $company;
        }

        try {
            return $this->findOneBy($params);
        } finally {
            if ($company instanceof Company) {
                $this->companySelector->switchCompany($company->getId());
            }
        }
    }
}
