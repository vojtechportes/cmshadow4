import React from 'react'
import { ColumnProps } from 'antd/es/table'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { MappedVariableNameAction } from './mapVariableNameActions'

export const getVariableNameActionsColumns = (
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
    key: 'variable_name',
    dataIndex: 'variable_name',
    title: t('table.columns.variable-name'),
    width: 200,
  },
  {
    key: 'path',
    dataIndex: 'path',
    width: 300,
    title: t('table.columns.path'),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: t('table.columns.action'),
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedVariableNameAction) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
