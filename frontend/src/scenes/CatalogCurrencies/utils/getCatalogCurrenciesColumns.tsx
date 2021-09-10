import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogCurrency } from './mapCatalogCurrencies'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getCatalogCurrenciesColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, id: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('table.columns.id'),
    width: 100,
    fixed: 'left',
  },
  {
    key: 'code',
    dataIndex: 'code',
    title: t('table.columns.code'),
    width: 150,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: t('table.columns.name'),
    width: 200,
  },
  {
    key: 'symbol',
    dataIndex: 'symbol',
    title: t('table.columns.symbol'),
    width: 200,
  },
  {
    key: 'rate',
    dataIndex: 'rate',
    title: t('table.columns.rate'),
    width: 150,
  },
  {
    key: 'is_main',
    dataIndex: 'is_main',
    title: t('table.columns.is-main'),
    render: (value: boolean) => (value ? t('table.yes') : t('table.no')),
    width: 100,
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedCatalogCurrency) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
