import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedButton } from './mapButtons'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getButtonsColumns = (
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
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedButton) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
