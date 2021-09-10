import React, { useCallback } from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Input } from 'formik-antd'
import { Input as InputAntd, Space } from 'antd'
import { useFormikContext } from 'formik'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { CatalogCurrency } from 'model/api/CatalogCurrency'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { getFieldValue } from './utils/getFieldValue'
import { MultiLingual } from './styles'

export interface PriceProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
  currencies: CatalogCurrency[]
}

export const Price: React.FC<PriceProps> = ({
  languages,
  currencies,
  field,
}) => {
  const { is_multilingual, id } = field
  const { t } = useTranslation('catalog-detail')
  const { values } = useFormikContext()

  const renderInput = useCallback(
    (name: string, language?: CatalogLanguage) => {
      if (!is_multilingual) {
        const mainCurrency = currencies.find(currency => !!currency.is_main)
        const otherCurrencies = currencies.filter(currency => !currency.is_main)
        const fieldValue = getFieldValue<number>(
          values,
          id,
          language && language.code
        )

        if (mainCurrency) {
          return (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Input
                type="number"
                min="0"
                name={name}
                addonBefore={mainCurrency.code}
              />
              {otherCurrencies.map(currency => {
                const value =
                  fieldValue &&
                  (currency.rate * fieldValue).toFixed(currency.decimal_places)

                return (
                  <InputAntd
                    disabled
                    value={value}
                    addonBefore={currency.code}
                  />
                )
              })}
            </Space>
          )
        }
      } else {
        const currency = currencies.find(
          currency => language && language.default_currency_id === currency.id
        )

        if (currency) {
          return (
            <Input
              type="number"
              min="0"
              name={name}
              addonBefore={currency.code}
            />
          )
        } else {
          return (
            <Alert
              type="warning"
              message={t('fields.price.no-default-currency-for-language', {
                language: language.name,
              })}
            />
          )
        }
      }

      return (
        <Alert type="warning" message={t('fields.price.no-main-currency')} />
      )
    },
    [currencies, t, id, values, is_multilingual]
  )

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(field, (name: string) => renderInput(name, language), language)
        )}
      </MultiLingual>
    )
  }

  return render(field, renderInput)
}
