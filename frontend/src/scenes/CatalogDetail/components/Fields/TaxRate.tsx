import React, { useCallback } from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Select } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { CatalogCurrency } from 'model/api/CatalogCurrency'
import { Alert, Tag, Space, Input as AntdInput } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogCurrencyTaxRate } from 'model/api/CatalogCurrencyTaxRate'
import { COLORS } from 'constants/colors'
import styled from 'styled-components'
import { MultiLingual } from './styles'

const { Group } = AntdInput

const { Option } = Select

const StyledSelect = styled(Select)`
  && {
    width: 100% !important;

    .ant-select-selector {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`

export interface TaxRateProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
  currencies: CatalogCurrency[]
  taxRates: CatalogCurrencyTaxRate[]
}

export const TaxRate: React.FC<TaxRateProps> = ({
  languages,
  currencies,
  taxRates,
  field,
}) => {
  const { is_multilingual } = field
  const { t } = useTranslation('catalog-detail')

  const renderTaxRateSelect = useCallback(
    (
      taxRates: CatalogCurrencyTaxRate[],
      currency: CatalogCurrency,
      name: string
    ) => (
      <Group className="ant-input-wrapper">
        <div className="ant-input-group-addon">{currency.code}</div>
        <StyledSelect name={name}>
          {taxRates.map(({ id, rate }) => (
            <Option value={String(id)} key={id}>
              {rate === null ? (
                <Tag color={COLORS.orange5}>
                  {t('fields.tax-rate.no-tax-rate')}
                </Tag>
              ) : (
                `${rate}%`
              )}
            </Option>
          ))}
        </StyledSelect>
      </Group>
    ),
    [t]
  )

  const renderInput = useCallback(
    (name: string, language?: CatalogLanguage) => {
      if (!is_multilingual) {
        const mainCurrency = currencies.find(currency => !!currency.is_main)

        if (mainCurrency) {
          const mainCurrencyTaxRates = taxRates.filter(
            item => item.currency_id === mainCurrency.id
          )

          return (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {renderTaxRateSelect(mainCurrencyTaxRates, mainCurrency, name)}
              <Alert
                type="info"
                message={t('fields.tax-rate.main-tax-rate-info')}
              />
            </Space>
          )
        }
      } else {
        const currency = currencies.find(
          currency => language && language.default_currency_id === currency.id
        )

        if (currency) {
          const currencyTaxRates = taxRates.filter(
            item => item.currency_id === currency.id
          )

          return renderTaxRateSelect(currencyTaxRates, currency, name)
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
    [currencies, taxRates, t, is_multilingual, renderTaxRateSelect]
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
