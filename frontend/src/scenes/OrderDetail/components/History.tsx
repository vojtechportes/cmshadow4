import React from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'antd'
import { OrderDetail } from 'model/api/OrderDetail'
import { getOrderHistoryColumns } from '../utils/getOrderHistoryColumns'
import { mapOrderHistory } from '../utils/mapOrderHistory'

const { Title } = Typography

export interface HistoryProps {
  data: OrderDetail
}

export const History: React.FC<HistoryProps> = ({ data: { history } }) => {
  const { t } = useTranslation('order-detail')

  return (
    <>
      <Title level={4}>{t('history.title')}</Title>
      <Table
        columns={getOrderHistoryColumns(t)}
        dataSource={mapOrderHistory(history, t)}
        expandedRowRender={record => record.description}
      />
    </>
  )
}
