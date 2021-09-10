import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getNavigationItemVariableMappingsColumns } from '../utils/getNavigationItemVariableMappingsColumns'
import {
  mapNavigationItemVariableMapping,
  MappedNavigationItemVariableMapping,
} from '../utils/mapNavigationItemVariableMappings'
import { NavigationsItemVariableMappingsApi } from 'api/NavigationItemVariableMappings'

export interface TableProps {
  navigationId: number
  navigationItemId: number
}

export const Table: React.FC<TableProps> = ({
  navigationId,
  navigationItemId,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-item-variable-mappings')
  const [data, setData] = useState<MappedNavigationItemVariableMapping[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await NavigationsItemVariableMappingsApi.getNavigationItemVariableMappings(
      navigationId,
      navigationItemId,
      page,
      pageSize,
      {
        cancelToken: cancelTokenRef.current.token,
      }
    )

    setData(mapNavigationItemVariableMapping(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize, navigationId, navigationItemId])

  const handleActionClick = useCallback(
    async (action: DropdownAction, variableMappindId: number) => {
      switch (action) {
        case 'edit':
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              navigationItemId +
              '/mappings/' +
              variableMappindId
          )
          break
        case 'delete':
          try {
            await NavigationsItemVariableMappingsApi.deleteNavigationItemVariableMapping(
              navigationId,
              navigationItemId,
              variableMappindId,
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
    [PUBLIC_URL, getData, t, navigationId, navigationItemId]
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
      columns={getNavigationItemVariableMappingsColumns(t, handleActionClick)}
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
