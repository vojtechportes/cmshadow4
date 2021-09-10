import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { VariableNameActionsApi } from 'api/VariableNameActions'
import {
  MappedVariableNameAction,
  mapVariableNameActions,
} from '../utils/mapVariableNameActions'
import { getVariableNameActionsColumns } from '../utils/getVariableNameActionsColumns'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('variable-name-actions')
  const [data, setData] = useState<MappedVariableNameAction[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await VariableNameActionsApi.getVariableNameActions(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapVariableNameActions(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, variableNameActionId: number) => {
      switch (action) {
        case 'edit':
          navigate(
            PUBLIC_URL +
              '/content/variable-name-actions/' +
              variableNameActionId
          )
          break
        case 'delete':
          try {
            await VariableNameActionsApi.deleteVariableNameAction(
              variableNameActionId,
              {
                cancelToken: cancelTokenRef.current.token,
              }
            )

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
      columns={getVariableNameActionsColumns(t, handleActionClick)}
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
