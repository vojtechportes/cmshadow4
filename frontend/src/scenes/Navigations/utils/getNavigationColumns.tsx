import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedNavigation } from './mapNavigations'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getNavigationsColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, viewId: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('table.columns.id'),
    width: 100,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: t('table.columns.name'),
    width: 200,
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
    render: (_, { id }: MappedNavigation) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
