import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik, FormikProps } from 'formik'
import { InputNumber, Switch, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Alert, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { CatalogCurrencyTaxRate } from 'model/api/CatalogCurrencyTaxRate'
import { CatalogCurrencyTaxRatesApi } from 'api/CatalogCurrencyTaxRates'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  rate?: number
  no_rate?: boolean
}

export const FormSchema = Yup.object().shape<FormValues>({
  rate: Yup.number(),
  no_rate: Yup.boolean(),
})

export interface FormProps {
  catalogCurrencyId?: number
  catalogCurrencyTaxRateId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({
  catalogCurrencyId,
  catalogCurrencyTaxRateId,
  view,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-currency-tax-rate-detail')
  const [data, setData] = useState<CatalogCurrencyTaxRate>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getFormInitialValues: () => FormValues = useCallback(() => {
    if (view === 'new' || !data) {
      return {
        rate: undefined,
        no_rate: false,
      }
    } else {
      console.log(data)
      return {
        rate: data.rate || undefined,
        no_rate: data.rate === null,
      }
    }
  }, [data, view])

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && catalogCurrencyId && catalogCurrencyTaxRateId) {
        setLoading(true)

        const {
          data,
        } = await CatalogCurrencyTaxRatesApi.getCatalogCurrencyTaxRate(
          catalogCurrencyId,
          catalogCurrencyTaxRateId,
          {
            cancelToken,
          }
        )

        setData(data)
        setLoading(false)
      }
    },
    [view, catalogCurrencyId, catalogCurrencyTaxRateId]
  )

  const handleSubmit = useCallback(
    async ({ rate, no_rate }: Required<FormValues>) => {
      try {
        setLoading(true)
        const data = new FormData()

        if (!no_rate) {
          data.append('rate', String(rate))
        }

        if (view === 'new') {
          await CatalogCurrencyTaxRatesApi.createCatalogCurrencyTaxRate(
            catalogCurrencyId,
            data,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          setLoading(false)

          notification.success({
            message: t('form.create-success'),
          })

          navigate(PUBLIC_URL + '/catalog/currencies/' + catalogCurrencyId)
        } else if (view === 'detail') {
          if (!no_rate) {
            data.append('rate', String(rate))
          } else {
            data.append('rate', '')
          }

          await CatalogCurrencyTaxRatesApi.updateCatalogCurrencyTaxRate(
            catalogCurrencyId,
            catalogCurrencyTaxRateId,
            data,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({
            message: t('form.update-success'),
          })

          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, catalogCurrencyId, catalogCurrencyTaxRateId, t]
  )

  const renderForm = useCallback(
    ({ values }: FormikProps<FormValues>) => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.rate')} name="rate">
          <InputNumber
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            min={0}
            name="rate"
            disabled={values.no_rate}
            style={{ width: '100%' }}
          />
        </Item>
        <Item label={t('form.no-rate')} name="no_rate">
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Switch name="no_rate" />
            <Alert type="info" message={t('form.no-rate-info')} />
          </Space>
        </Item>
        <ItemAntd>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={loading}
          >
            {t(view === 'new' ? 'form.submit.new' : 'form.submit.detail')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, view, loading]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <Formik<FormValues>
      initialValues={getFormInitialValues()}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {props => renderForm(props)}
    </Formik>
  )
}
