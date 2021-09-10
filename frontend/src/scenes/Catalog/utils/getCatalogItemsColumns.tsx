import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogItem } from './mapCatalogItems'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'
import { Tag } from 'antd'
import { COLORS } from 'constants/colors'
import { Link } from '@reach/router'

const { PUBLIC_URL } = process.env

export const getCatalogItemsColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, id: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('table.columns.id'),
    fixed: 'left',
    width: 90,
  },
  {
    key: 'field_name_value',
    dataIndex: 'field_name_value',
    title: t('table.columns.field-name-value'),
    width: 200,
    render: (value: string | null, record: MappedCatalogItem) => (
      <Link to={`${PUBLIC_URL}/catalog/${record.id}`}>
        {value ? value : t('table.n-a')}
      </Link>
    ),
  },
  {
    key: 'field_sku_value',
    dataIndex: 'field_sku_value',
    title: t('table.columns.field-sku-value'),
    width: 200,
    render: (value: string | null) => (value ? value : t('table.n-a')),
  },
  {
    key: 'created_at',
    dataIndex: 'created_at',
    title: t('table.columns.created-at'),
    render: (value: Date) => format(value, DATE_TIME_FORMAT),
    width: 170,
  },
  {
    key: 'modified_at',
    dataIndex: 'modified_at',
    title: t('table.columns.modified-at'),
    render: (value: Date | null) =>
      value ? format(value, DATE_TIME_FORMAT) : '-',
    width: 170,
  },
  {
    key: 'published_at',
    dataIndex: 'published_at',
    title: t('table.columns.published-at'),
    render: (value: Date | null) =>
      value ? format(value, DATE_TIME_FORMAT) : '-',
    width: 170,
  },
  {
    key: 'published',
    dataIndex: 'published',
    title: t('table.columns.status'),
    render: (value: boolean) =>
      value && <Tag color={COLORS.green2}>{t('table.published')}</Tag>,
    width: 120,
  },
  {
    key: 'booked',
    dataIndex: 'booked',
    title: t('table.columns.booked'),
    render: (value: boolean) =>
      value ? t('table.yes') : t('table.no'),
    width: 120,
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id, published }: MappedCatalogItem) => (
      <Dropdown
        disabledActions={published ? ['publish'] : ['unpublish']}
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
