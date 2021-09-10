import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Switch, Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Alert, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { CatalogCurrenciesApi } from 'api/CatalogCurrencies'
import {
  MappedCatalogCurrency,
  mapCatalogCurrency,
} from '../utils/mapCatalogCurrency'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  name?: string
  code?: string
  symbol?: string
  rate?: number
  decimal_places?: number
  is_main?: boolean
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  code: Yup.string().required(),
  symbol: Yup.string().required(),
  rate: Yup.number().required(),
  decimal_places: Yup.number(),
  is_main: Yup.boolean(),
})

export interface FormProps {
  catalogCurrencyId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ catalogCurrencyId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-currency-detail')
  const [data, setData] = useState<MappedCatalogCurrency>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = data || {
    name: undefined,
    code: undefined,
    symbol: undefined,
    rate: 1,
    decimal_places: 2,
    is_main: false,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && catalogCurrencyId) {
        setLoading(true)

        const { data } = await CatalogCurrenciesApi.getCatalogCurrency(
          catalogCurrencyId,
          {
            cancelToken,
          }
        )

        setData(mapCatalogCurrency(data))
        setLoading(false)
      }
    },
    [view, catalogCurrencyId]
  )

  const handleSubmit = useCallback(
    async ({
      code,
      decimal_places,
      is_main,
      name,
      rate,
      symbol,
    }: Required<FormValues>) => {
      try {
        setLoading(true)
        const data = new FormData()

        data.append('name', name)
        data.append('code', code)
        data.append('symbol', symbol)
        data.append('rate', String(rate))
        data.append('decimal_places', String(decimal_places))

        if (view === 'detail') {
          data.append('is_main', String(+is_main))
        } else {
          data.append('is_main', '0')
        }

        if (view === 'new') {
          const {
            data: { id },
          } = await CatalogCurrenciesApi.createCatalogCurrency(data, {
            cancelToken: cancelTokenRef.current.token,
          })

          setLoading(false)

          notification.success({
            message: t('form.create-success'),
          })

          navigate(PUBLIC_URL + '/catalog/currencies/' + id)
        } else if (view === 'detail') {
          await CatalogCurrenciesApi.updateCatalogCurrency(
            catalogCurrencyId,
            data,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({
            message: t('form.update-success'),
          })

          setLoading(false)

          const to = PUBLIC_URL + '/catalog/currencies/' + catalogCurrencyId

          navigate(PUBLIC_URL + '/redirect-to', {
            state: {
              to,
            },
          })
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, catalogCurrencyId, t]
  )

  const renderForm = useCallback(() => {
    return (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.code')} name="code">
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Input name="code" />
          </Space>
        </Item>
        <Item label={t('form.symbol')} name="symbol">
          <Input name="symbol" />
        </Item>
        <Item label={t('form.rate')} name="rate">
          <Input name="rate" type="number" />
        </Item>
        <Item label={t('form.decimal-places')} name="decimal_places">
          <Input name="decimal_places" type="number" />
        </Item>
        <Item label={t('form.is-main')} name="is_main">
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Switch
              name="is_main"
              disabled={view === 'new' || (data && data.is_main)}
            />

            {view === 'new' ||
              (data && data.is_main && (
                <Alert type="info" message={t('form.is-main-info')} />
              ))}

            {view === 'new' && (
              <Alert type="info" message={t('form.is-main-info-new')} />
            )}

            {view === 'detail' && (
              <Alert
                type="warning"
                message={t('form.is-main-warning-detail')}
              />
            )}
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
    )
  }, [t, view, data, loading])

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
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {() => renderForm()}
    </Formik>
  )
}
