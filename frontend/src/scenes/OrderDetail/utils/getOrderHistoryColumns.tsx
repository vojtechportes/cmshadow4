import React from 'react'
import { ColumnProps } from 'antd/es/table'
import i18next from 'i18next'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'
import { ORDERS_STATUS_COLORS } from 'constants/colors'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'
import { Tag } from 'antd'

export const getOrderHistoryColumns = (
  t: i18next.TFunction,
): ColumnProps<any>[] => [
  {
    key: 'from_status',
    dataIndex: 'from_status',
    title: t('history.table.columns.from-status'),
    render: (value: OrderStatusEnum) => (
      <Tag color={ORDERS_STATUS_COLORS[value]}>{value}</Tag>
    ),
  },  {
    key: 'to_status',
    dataIndex: 'to_status',
    title: t('history.table.columns.to-status'),
    render: (value: OrderStatusEnum) => (
      <Tag color={ORDERS_STATUS_COLORS[value]}>{value}</Tag>
    ),
  },
  {
    key: 'created_at',
    dataIndex: 'created_at',
    title: t('history.table.columns.created-at'),
    render: (value: Date) => format(value, DATE_TIME_FORMAT),
    width: 170,
  },
]
