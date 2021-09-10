import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedNavigationItemVariableMapping } from './mapNavigationItemVariableMappings'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getNavigationItemVariableMappingsColumns = (
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
    key: 'value',
    dataIndex: 'value',
    title: t('table.columns.value'),
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedNavigationItemVariableMapping) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
