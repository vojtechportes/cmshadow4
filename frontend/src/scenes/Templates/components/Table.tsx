import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'
import { notification } from 'antd'
import { getTemplatesColumns } from '../utils/getTemplatesColumns'
import { TemplatesApi } from 'api/Templates'
import { MappedTemplate, mapTemplates } from '../utils/mapTemplates'

export const Table: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('templates')
  const [data, setData] = useState<MappedTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await TemplatesApi.getTemplates(page, pageSize, {
      cancelToken: cancelTokenRef.current.token,
    })

    setData(mapTemplates(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize])

  const handleActionClick = useCallback(
    async (action: DropdownAction, templateId: number) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/content/templates/' + templateId)
          break
        case 'delete':
          try {
            await TemplatesApi.deleteTemplate(templateId, {
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
      columns={getTemplatesColumns(t, handleActionClick)}
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
