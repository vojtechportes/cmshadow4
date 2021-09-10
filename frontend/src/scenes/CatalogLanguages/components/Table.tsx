import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getCatalogLanguagesColumns } from '../utils/getCatalogLanguagesColumns'
import {
  mapCatalogLanguages,
  MappedCatalogLanguage,
} from '../utils/mapCatalogLanguages'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-languages')
  const [data, setData] = useState<MappedCatalogLanguage[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogLanguagesApi.getCatalogLanguages(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapCatalogLanguages(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, code: string) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/catalog/languages/' + code)
          break
        case 'delete':
          try {
            await CatalogLanguagesApi.deleteCatalogLanguage(code, {
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
      columns={getCatalogLanguagesColumns(t, handleActionClick)}
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
