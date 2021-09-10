import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedOrder } from './mapOrders'
import i18next from 'i18next'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'
import { ORDERS_STATUS_COLORS } from 'constants/colors'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'
import { Tag } from 'antd'
import { DropdownAction, Dropdown } from '../components/Dropdown'

export const getOrdersColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, silent: boolean, viewId: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('table.columns.id'),
    width: 100,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: t('table.columns.status'),
    render: (value: OrderStatusEnum) => (
      <Tag color={ORDERS_STATUS_COLORS[value]}>{value}</Tag>
    ),
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
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id, status }: MappedOrder) => (
      <Dropdown
        status={status}
        onClick={(action: DropdownAction, silent: boolean) => onClick && onClick(action, silent, id)}
      />
    ),
    fixed: 'right',
  },
]
