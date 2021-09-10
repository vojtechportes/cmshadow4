import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getOrdersColumns } from '../utils/getOrdersColumns'
import { MappedOrder, mapOrders } from '../utils/mapOrders'
import { OrdersApi } from 'api/Orders'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('orders')
  const [data, setData] = useState<MappedOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await OrdersApi.getOrders(undefined, page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapOrders(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, silent: boolean, orderId: number) => {
      switch (action) {
        case 'view':
          navigate(PUBLIC_URL + '/orders/' + orderId)
          break
        case 'delete':
          try {
            await OrdersApi.deleteOrder(orderId, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.delete-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'accept':
          try {
            await OrdersApi.changeOrderStatus(
              orderId,
              OrderStatusEnum.ACCEPTED,
              silent,
              {
                cancelToken: cancelTokenRef.current.token,
              }
            )

            notification.success({
              message: t('table.accept-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'reject':
          try {
            await OrdersApi.changeOrderStatus(
              orderId,
              OrderStatusEnum.REJECTED,
              silent,
              {
                cancelToken: cancelTokenRef.current.token,
              }
            )

            notification.success({
              message: t('table.reject-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'close':
          try {
            await OrdersApi.changeOrderStatus(
              orderId,
              OrderStatusEnum.CLOSED,
              silent,
              {
                cancelToken: cancelTokenRef.current.token,
              }
            )

            notification.success({
              message: t('table.close-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'reopen':
          try {
            await OrdersApi.changeOrderStatus(
              orderId,
              OrderStatusEnum.NEW,
              silent,
              {
                cancelToken: cancelTokenRef.current.token,
              }
            )

            notification.success({
              message: t('table.reopen-success'),
            })

            getData()
          } catch (e) {}
          break
        default:
          break
      }
    },
    [PUBLIC_URL, getData, t]
  )

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <TableBase
      columns={getOrdersColumns(t, handleActionClick)}
      dataSource={data}
      loading={loading}
      expandable={{
        expandedRowRender: record => record.description,
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: handlePageChange,
      }}
    />
  )
}
