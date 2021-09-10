import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getButtonsColumns } from '../utils/getButtonsColumns'
import { MappedButton, mapButtons } from '../utils/mapButtons'
import { ButtonsApi } from 'api/Buttons'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('buttons')
  const [data, setData] = useState<MappedButton[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await ButtonsApi.getButtons(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapButtons(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, buttonId: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/content/modules/buttons/' + buttonId)
          break
        case 'delete':
          try {
            await ButtonsApi.deleteButton(buttonId, {
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
      columns={getButtonsColumns(t, handleActionClick)}
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
