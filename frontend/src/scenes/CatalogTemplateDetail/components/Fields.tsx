import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Divider, Typography, notification, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { CatalogItemTemplateFieldsApi } from 'api/CatalogItemTemplateFields'
import { navigate } from '@reach/router'
import { IconButton } from 'components/IconButton'
import styled from 'styled-components'
import { DropdownAction } from './Dropdown'
import {
  mapCatalogTemplateFields,
  MappedCatalogTemplateField,
} from '../utils/mapCatalogTemplateFields'
import { getCatalogTemplateFieldsColumns } from '../utils/getCatalogTemplateFieldsColumns'

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const { Title } = Typography

export interface FieldsProps {
  catalogItemTempalteId: number
}

export const Fields: React.FC<FieldsProps> = ({ catalogItemTempalteId }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-template-detail')
  const [data, setData] = useState<MappedCatalogTemplateField[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogItemTemplateFieldsApi.getCatalogItemTemplateFields(
      catalogItemTempalteId,
      page,
      pageSize,
      {
        cancelToken: cancelTokenRef.current.token,
      }
    )

    setData(mapCatalogTemplateFields(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize, catalogItemTempalteId])

  const handleActionClick = useCallback(
    async (action: DropdownAction, id: number) => {
      switch (action) {
        case 'edit':
          navigate(
            PUBLIC_URL +
              '/catalog/templates/' +
              catalogItemTempalteId +
              '/fields/' +
              id
          )
          break
        case 'delete':
          try {
          await CatalogItemTemplateFieldsApi.deleteCatalogItemTemplateField(
            catalogItemTempalteId,
            id,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({
            message: t('fields.table.delete-success'),
          })

          getData()
          } catch (e) {}
          break
        default:
          break
      }
    },
    [PUBLIC_URL, getData, t, catalogItemTempalteId]
  )

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
  }, [])

  const handleCreateField = useCallback(() => {
    navigate(
      PUBLIC_URL + '/catalog/templates/' + catalogItemTempalteId + '/fields/new'
    )
  }, [PUBLIC_URL, catalogItemTempalteId])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <>
      <Divider />
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <TitleContainer>
          <Title level={3}>{t('fields.title')}</Title>
          <IconButton
            size="middle"
            type="primary"
            icon="plus"
            onClick={handleCreateField}
          >
            {t('fields.create-new-field')}
          </IconButton>
        </TitleContainer>
        <Table
          columns={getCatalogTemplateFieldsColumns(t, handleActionClick)}
          dataSource={data}
          loading={loading}
          isScrollable={true}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
        />
      </Space>
    </>
  )
}
