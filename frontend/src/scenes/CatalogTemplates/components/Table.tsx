import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import { CatalogItemTemplatesApi } from 'api/CatalogItemTemplates'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getCatalogTemplatesColumns } from '../utils/getCatalogTemplatesColumns'
import {
  mapCatalogTemplates,
  MappedCatalogTemplate,
} from '../utils/mapCatalogTemplates'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-templates')
  const [data, setData] = useState<MappedCatalogTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogItemTemplatesApi.getCatalogItemTemplates(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapCatalogTemplates(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, id: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/catalog/templates/' + id)
          break
        case 'delete':
          await CatalogItemTemplatesApi.deleteCatalogItemTemplate(id, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({
            message: t('table.delete-success'),
          })

          getData()
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
      columns={getCatalogTemplatesColumns(t, handleActionClick)}
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
