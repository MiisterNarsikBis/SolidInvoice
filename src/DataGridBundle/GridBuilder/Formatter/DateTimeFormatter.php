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

namespace SolidInvoice\DataGridBundle\GridBuilder\Formatter;

use Carbon\CarbonImmutable;
use DateTime;
use DateTimeInterface;
use SolidInvoice\DataGridBundle\GridBuilder\Column\Column;
use SolidInvoice\DataGridBundle\GridBuilder\Column\DateTimeColumn;
use Symfony\Component\Translation\TranslatableMessage;
use Symfony\Contracts\Translation\LocaleAwareInterface;

/**
 * @see \SolidInvoice\DataGridBundle\Tests\GridBuilder\Formatter\DateTimeFormatterTest
 */
class DateTimeFormatter implements FormatterInterface
{
    public function __construct(
        private readonly ?LocaleAwareInterface $localeProvider = null,
    ) {
    }

    public function format(Column $column, mixed $value): string | TranslatableMessage
    {
        if (null === $value) {
            return '';
        }

        assert($column instanceof DateTimeColumn);

        if (! $value instanceof DateTimeInterface) {
            $value = new DateTime($value);
        }

        // translatedFormat() renders month and day names in the user's locale
        return CarbonImmutable::instance($value)
            ->locale($this->localeProvider?->getLocale() ?? 'en')
            ->translatedFormat($column->getFormat());
    }
}
