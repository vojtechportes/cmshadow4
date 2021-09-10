import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogTaxRate } from './mapCatalogTaxRates'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { Tag } from 'antd'
import { COLORS } from 'constants/colors'

export const getCatalogTaxRatesColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, id: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('tax-rates.columns.id'),
    width: 100,
  },
  {
    key: 'rate',
    dataIndex: 'rate',
    title: t('tax-rates.columns.rate'),
    render: (value: number | null) =>
      value === null ? (
        <Tag color={COLORS.orange5}>{t('tax-rates.no-tax-rate')}</Tag>
      ) : (
        `${value}%`
      ),
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedCatalogTaxRate) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
