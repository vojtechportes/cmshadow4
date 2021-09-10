import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Table as TableBase } from 'components/Table'
import { PagesApi } from 'api/Pages'
import axios, { CancelTokenSource } from 'axios'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { navigate, WindowLocation } from '@reach/router'
import { notification } from 'antd'
import { getPagesColumns } from '../utils/getPagesColumns'
import { mapPages, MappedPage } from '../utils/mapPages'
import { parse } from 'query-string'
import { Page } from 'model/api/Page'
import { IconButton } from 'components/IconButton'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const StyledTable = styled(TableBase)`
  && {
    .ant-table-title {
      background: ${COLORS.gray0};
      border-bottom: 1px solid #f0f0f0;
    }
  }
`

export interface TableProps {
  location: WindowLocation
}

export const Table: React.FC<TableProps> = ({ location }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('content')
  const [data, setData] = useState<MappedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [parentPage, setParentPage] = useState<Page>()
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const { parent } = parse(location.search)

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await PagesApi.getPages(
      parent ? String(parent) : undefined,
      page,
      pageSize,
      {
        cancelToken: cancelTokenRef.current.token,
      }
    )

    setData(mapPages(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize, parent])

  const getParentPage = useCallback(async () => {
    if (parent) {
      try {
        setLoading(true)

        const { data } = await PagesApi.getPage(String(parent), {
          cancelToken: cancelTokenRef.current.token,
        })
        setParentPage(data)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    } else {
      setParentPage(undefined)
    }
  }, [parent])

  const handleActionClick = useCallback(
    async (action: DropdownAction, identifier: string) => {
      switch (action) {
        case 'edit':
          navigate(PUBLIC_URL + '/content/' + identifier)
          break
        case 'add':
          navigate(PUBLIC_URL + '/content/new?parent=' + identifier)
          break
        case 'publish':
          try {
            await PagesApi.publishPage(identifier, {
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
            await PagesApi.unpublishPage(identifier, {
              cancelToken: cancelTokenRef.current.token,
            })

            notification.success({
              message: t('table.unpublish-success'),
            })

            getData()
          } catch (e) {}
          break
        case 'delete':
          try {
            await PagesApi.deletePage(identifier, {
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

  const handleLevelUp = useCallback(() => {
    navigate(PUBLIC_URL + '/content?parent=' + parentPage.parent)
  }, [parentPage, PUBLIC_URL])

  useEffect(() => {
    getParentPage()
    getData()
  }, [getData, getParentPage])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <>
      <StyledTable
        isScrollable
        columns={getPagesColumns(t, handleActionClick)}
        dataSource={data}
        loading={loading}
        title={() => (
          <IconButton
            onClick={handleLevelUp}
            icon="arrow-up"
            disabled={!parentPage}
          >
            {t('one-level-up')}
          </IconButton>
        )}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
        }}
      />
    </>
  )
}
