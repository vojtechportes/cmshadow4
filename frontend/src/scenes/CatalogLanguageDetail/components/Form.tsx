import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Select, Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Alert, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { navigate } from '@reach/router'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { CatalogCurrenciesApi } from 'api/CatalogCurrencies'
import { CatalogCurrency } from 'model/api/CatalogCurrency'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  name?: string
  code?: string
  default_currency_id?: number
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  code: Yup.string().required(),
  default_currency_id: Yup.number()
})

export interface FormProps {
  code?: string
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ code, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-language-detail')
  const [data, setData] = useState<CatalogLanguage>()
  const [currencies, setCurrencies] = useState<CatalogCurrency[]>([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = data || {
    name: undefined,
    code: undefined,
    default_currency_id: undefined
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && code) {
        setLoading(true)

        const { data } = await CatalogLanguagesApi.getCatalogLanguage(code, {
          cancelToken,
        })

        setData(data)
        setLoading(false)
      }
    },
    [view, code]
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
    [setCurrencies]
  )

  const handleSubmit = useCallback(
    async ({ code: languageCode, name, default_currency_id }: Required<FormValues>) => {
      try {
        setLoading(true)
        const data = new FormData()

        data.append('name', name)
        data.append('code', languageCode)
        data.append('default_currency_id', String(default_currency_id))

        if (view === 'new') {
          await CatalogLanguagesApi.createCatalogLanguage(data, {
            cancelToken: cancelTokenRef.current.token,
          })

          setLoading(false)

          notification.success({
            message: t('form.create-success'),
          })

          navigate(PUBLIC_URL + '/catalog/languages')
        } else if (view === 'detail') {
          await CatalogLanguagesApi.updateCatalogLanguage(code, data, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({
            message: t('form.update-success'),
          })

          setLoading(false)

          if (code !== languageCode) {
            const to = PUBLIC_URL + '/catalog/languages/' + languageCode

            navigate(PUBLIC_URL + '/redirect-to', {
              state: {
                to,
              },
            })
          }
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, code, t]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.code')} name="code">
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Input name="code" />
            {view === 'detail' && (
              <Alert type="warning" message={t('form.code-warning')} />
            )}
          </Space>
        </Item>
        <Item label={t('form.currency')} name="default_currency_id">
          <Select name="default_currency_id">
            {currencies.map(({ name, code, id }) => (
              <Option value={id} key={id}>
                {name} ({code})
              </Option>
            ))}
          </Select>
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
    [t, view, loading, currencies]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getCurrencies(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getCurrencies])

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
