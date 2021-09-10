import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import { CatalogItemsApi } from 'api/CatalogItems'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getCatalogItemsColumns } from '../utils/getCatalogItemsColumns'
import { mapCatalogItems, MappedCatalogItem } from '../utils/mapCatalogItems'
import { SubmittedFilterValues } from './Filters'

export interface TableProps {
  filters: SubmittedFilterValues
}

export const Table: React.FC<TableProps> = ({
  filters: { categories, name, sku },
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog')
  const [data, setData] = useState<MappedCatalogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogItemsApi.getCatalogItems(
      page,
      pageSize,
      categories,
      name,
      sku,
      {
        cancelToken: cancelTokenRef.current.token,
      }
    )

    setData(mapCatalogItems(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize, categories, name, sku])

  const handleActionClick = useCallback(
    async (action: DropdownAction, id: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/catalog/' + id)
          break
        case 'publish':
          try {
            await CatalogItemsApi.publishCatalogItem(id, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.publish-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'unpublish':
          try {
            await CatalogItemsApi.unpublishCatalogItem(id, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.unpublish-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'book':
          try {
            await CatalogItemsApi.bookCatalogItem(id, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.book-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'unbook':
          try {
            await CatalogItemsApi.unbookCatalogItem(id, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.unbook-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'delete':
          try {
            await CatalogItemsApi.deleteCatalogItem(id, {
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
  }, [getData, categories, name])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <TableBase
      columns={getCatalogItemsColumns(t, handleActionClick)}
      dataSource={data}
      loading={loading}
      isScrollable
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: handlePageChange,
      }}
    />
  )
}
