import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getLayoutsColumns } from '../utils/getLayoutsColumns'
import { LayoutsApi } from 'api/Layouts'
import { MappedLayout, mapLayouts } from '../utils/mapLayouts'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('layouts')
  const [data, setData] = useState<MappedLayout[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await LayoutsApi.getLayouts(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapLayouts(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, layoutId: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/content/layouts/' + layoutId)
          break
        case 'delete':
          try {
            await LayoutsApi.deleteLayout(layoutId, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.delete-success'),
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
      columns={getLayoutsColumns(t, handleActionClick)}
      dataSource={data}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: handlePageChange,
      }}
    />
  )
}
