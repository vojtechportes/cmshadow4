import React, { useCallback, useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import axios, { CancelToken } from 'axios'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogItemTemplateFieldTypeEnum } from 'model/api/CatalogItemTemplateFieldTypeEnum'
import { String as StringComponent } from './Fields/String'
import { Boolean } from './Fields/Boolean'
import { Date } from './Fields/Date'
import { DateTime } from './Fields/DateTime'
import { Integer } from './Fields/Integer'
import { Link } from './Fields/Link'
import { Text } from './Fields/Text'
import { RichText } from './Fields/RichText'
import { Gallery } from './Fields/Gallery'
import { Price } from './Fields/Price'
import { TaxRate } from './Fields/TaxRate'
import { Skeleton } from 'antd'
import { CatalogDetailContext } from '..'
import { CatalogCurrenciesApi } from 'api/CatalogCurrencies'
import { CatalogCurrencyTaxRatesApi } from 'api/CatalogCurrencyTaxRates'
import { CatalogCurrency } from 'model/api/CatalogCurrency'
import { CatalogCurrencyTaxRate } from 'model/api/CatalogCurrencyTaxRate'
import { Image } from './Fields/Image'

export const Data: React.FC = () => {
  const { t } = useTranslation('catalog-detail')
  const [languages, setLanguages] = useState<CatalogLanguage[]>([])
  const [currencies, setCurrencies] = useState<CatalogCurrency[]>([])
  const [currencyTaxRates, setCurrencyTaxRates] = useState<
    CatalogCurrencyTaxRate[]
  >([])
  const { data, loading, setLoading } = useContext(CatalogDetailContext)

  const getLanguages = useCallback(
    async (cancelToken: CancelToken) => {
      setLoading(true)

      const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
        cancelToken,
      })

      setLanguages(data)
      setLoading(false)
    },
    [setLoading]
  )

  const getCurrencies = useCallback(
    async (cancelToken: CancelToken) => {
      setLoading(true)

      const { data } = await CatalogCurrenciesApi.getAllCatalogCurrencies({
        cancelToken,
      })

      setCurrencies(data)
      setLoading(false)
    },
    [setLoading]
  )

  const getCurrencyTaxRates = useCallback(
    async (cancelToken: CancelToken) => {
      setLoading(true)

      const {
        data,
      } = await CatalogCurrencyTaxRatesApi.getAllCatalogCurrencyTaxRates(
        undefined,
        {
          cancelToken,
        }
      )

      setCurrencyTaxRates(data)
      setLoading(false)
    },
    [setLoading]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getLanguages(cancelTokenSource.token)
    getCurrencies(cancelTokenSource.token)
    getCurrencyTaxRates(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getLanguages, getCurrencies, getCurrencyTaxRates])

  if (loading) {
    return <Skeleton active loading paragraph={{ rows: 4, width: '400px' }} />
  }

  if (data) {
    const { fields } = data

    return (
      <div>
        {fields.map(field => {
          switch (field.type) {
            case CatalogItemTemplateFieldTypeEnum.STRING:
              return (
                <StringComponent
                  languages={languages}
                  field={field}
                  key={field.id}
                />
              )
            case CatalogItemTemplateFieldTypeEnum.BOOLEAN:
              return (
                <Boolean languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.DATE:
              return <Date languages={languages} field={field} key={field.id} />
            case CatalogItemTemplateFieldTypeEnum.DATE_TIME:
              return (
                <DateTime languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.INTEGER:
              return (
                <Integer languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.LINK:
              return (
                <Link
                  languages={languages}
                  field={field}
                  t={t}
                  key={field.id}
                />
              )
            case CatalogItemTemplateFieldTypeEnum.TEXT:
              return <Text languages={languages} field={field} key={field.id} />
            case CatalogItemTemplateFieldTypeEnum.RICH_TEXT:
              return (
                <RichText languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.GALLERY:
              return (
                <Gallery languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.IMAGE:
              return (
                <Image languages={languages} field={field} key={field.id} />
              )
            case CatalogItemTemplateFieldTypeEnum.PRICE:
              return (
                <Price
                  languages={languages}
                  currencies={currencies}
                  field={field}
                  key={field.id}
                />
              )
            case CatalogItemTemplateFieldTypeEnum.TAX_RATE:
              return (
                <TaxRate
                  languages={languages}
                  currencies={currencies}
                  taxRates={currencyTaxRates}
                  field={field}
                  key={field.id}
                />
              )
            default:
              return null
          }
        })}
      </div>
    )
  }

  return null
}
