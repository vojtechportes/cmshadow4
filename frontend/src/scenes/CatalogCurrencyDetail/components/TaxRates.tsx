import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Divider, Typography, notification, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components/Table'
import axios, { CancelTokenSource } from 'axios'
import { CatalogCurrencyTaxRatesApi } from 'api/CatalogCurrencyTaxRates'
import { navigate } from '@reach/router'
import { IconButton } from 'components/IconButton'
import styled from 'styled-components'
import { DropdownAction } from './Dropdown'
import { getCatalogTaxRatesColumns } from '../utils/getCatalogTaxRatesColumns'
import { mapCatalogTaxRates, MappedCatalogTaxRate } from '../utils/mapCatalogTaxRates'

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const { Title } = Typography

export interface TaxRatesProps {
  catalogCurrencyId: number
}

export const TaxRates: React.FC<TaxRatesProps> = ({ catalogCurrencyId }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-currency-detail')
  const [data, setData] = useState<MappedCatalogTaxRate[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    setLoading(true)

    const {
      data: { data, total, per_page },
    } = await CatalogCurrencyTaxRatesApi.getCatalogCurrencyTaxRates(
      catalogCurrencyId,
      page,
      pageSize,
      {
        cancelToken: cancelTokenRef.current.token,
      }
    )

    setData(mapCatalogTaxRates(data))
    setTotal(total)
    setPageSize(per_page)
    setLoading(false)
  }, [page, pageSize, catalogCurrencyId])

  const handleActionClick = useCallback(
    async (action: DropdownAction, id: number) => {
      switch (action) {
        case 'edit':
          navigate(
            PUBLIC_URL +
              '/catalog/currencies/' +
              catalogCurrencyId +
              '/tax-rates/' +
              id
          )
          break
        case 'delete':
          try {
          await CatalogCurrencyTaxRatesApi.deleteCatalogCurrencyTaxRate(
            catalogCurrencyId,
            id,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({
            message: t('tax-rates.delete-success'),
          })

          getData()
          } catch (e) {}
          break
        default:
          break
      }
    },
    [PUBLIC_URL, getData, t, catalogCurrencyId]
  )

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
  }, [])

  const handleCreateTaxRate = useCallback(() => {
    navigate(
      PUBLIC_URL + '/catalog/currencies/' + catalogCurrencyId + '/tax-rates/new'
    )
  }, [PUBLIC_URL, catalogCurrencyId])

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
          <Title level={3}>{t('tax-rates.title')}</Title>
          <IconButton
            size="middle"
            type="primary"
            icon="plus"
            onClick={handleCreateTaxRate}
          >
            {t('tax-rates.create-new-tax-rate')}
          </IconButton>
        </TitleContainer>
        <Table
          columns={getCatalogTaxRatesColumns(t, handleActionClick)}
          dataSource={data}
          loading={loading}
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
