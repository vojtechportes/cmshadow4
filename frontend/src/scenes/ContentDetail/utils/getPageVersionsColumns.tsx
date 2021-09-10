import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedPageVersion } from './mapPageVersions'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Versions/Dropdown'
import { PAGE_STATUS_COLORS } from 'constants/colors'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'
import { Tag } from 'antd'
import { PageStatusEnum } from 'model/api/PageStatusEnum'

export const getPageVersionsColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, identifier: string) => void
): ColumnProps<any>[] => [
  {
    dataIndex: 'version',
    title: t('versions.table.columns.version'),
    width: 150,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: t('versions.table.columns.status'),
    width: 220,
    render: (value: PageStatusEnum) => (
      <Tag color={PAGE_STATUS_COLORS[value]}>{value}</Tag>
    ),
  },
  {
    key: 'modified_at',
    dataIndex: 'modified_at',
    title: t('versions.table.columns.modified-at'),
    render: (value: Date | null) =>
      value ? format(value, DATE_TIME_FORMAT) : '-',
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { identifier }: MappedPageVersion) => (
      <Dropdown
        onClick={(action: DropdownAction) =>
          onClick && onClick(action, identifier)
        }
      />
    ),
  },
]
