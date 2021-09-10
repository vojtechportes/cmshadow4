import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import { CatalogCurrenciesApi } from 'api/CatalogCurrencies'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getCatalogCurrenciesColumns } from '../utils/getCatalogCurrenciesColumns'
import {
  mapCatalogCurrencies,
  MappedCatalogCurrency,
} from '../utils/mapCatalogCurrencies'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-currencies')
  const [data, setData] = useState<MappedCatalogCurrency[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogCurrenciesApi.getCatalogCurrencies(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapCatalogCurrencies(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, catalogCurrencyId: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/catalog/currencies/' + catalogCurrencyId)
          break
        case 'delete':
          try {
            /* await CatalogCurrenciesApi.deleteCatalogLanguage(code, {
              cancelToken: cancelTokenRef.current.token,
            }) */

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
      columns={getCatalogCurrenciesColumns(t, handleActionClick)}
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
