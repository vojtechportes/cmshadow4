import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogLanguage } from './mapCatalogLanguages'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getCatalogLanguagesColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, code: string) => void
): ColumnProps<any>[] => [
  {
    key: 'code',
    dataIndex: 'code',
    title: t('table.columns.code'),
    width: 200,
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
    render: (_, { code }: MappedCatalogLanguage) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, code)}
      />
    ),
    fixed: 'right',
  },
]
