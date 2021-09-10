import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogTemplate } from './mapCatalogTemplates'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getCatalogTemplatesColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, id: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('table.columns.id'),
  },
  {
    key: 'view_id',
    dataIndex: 'view_id',
    title: t('table.columns.view-id'),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: t('table.columns.name'),
  },
  {
    key: 'path',
    dataIndex: 'path',
    title: t('table.columns.path'),
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedCatalogTemplate) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
  },
]
