import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedEmailTemplate } from './mapEmailTemplate'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'

export const getEmailTemplateColumns = (
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
    key: 'type',
    dataIndex: 'type',
    title: t('table.columns.type'),
    width: 250,
  },
  {
    key: 'language',
    dataIndex: 'language',
    title: t('table.columns.language'),
    width: 100,
  },
  {
    key: 'created_at',
    dataIndex: 'created_at',
    title: t('table.columns.created-at'),
    width: 170,
    render: (value: Date) => format(value, DATE_TIME_FORMAT),
  },
  {
    key: 'modified_at',
    dataIndex: 'modified_at',
    title: t('table.columns.modified-at'),
    render: (value: Date | null) =>
      value ? format(value, DATE_TIME_FORMAT) : '-',
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedEmailTemplate) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
    fixed: 'right',
  },
]
