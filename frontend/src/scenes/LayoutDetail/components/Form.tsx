import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { Layout } from 'model/api/Layout'
import { LayoutsApi } from 'api/Layouts'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  name?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
})

export interface FormProps {
  layoutId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ layoutId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('layout-detail')
  const [data, setData] = useState<Layout>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    name: undefined,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && layoutId) {
        try {
          setLoading(true)

          const { data } = await LayoutsApi.getLayout(layoutId, {
            cancelToken,
          })

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, layoutId]
  )

  const handleSubmit = useCallback(
    async ({ name }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)

        if (view === 'new') {
          const {
            data: { id },
          } = await LayoutsApi.createLayout(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/layouts/' + id)
        } else if (view === 'detail' && layoutId) {
          await LayoutsApi.updateLayout(layoutId, formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('update-success') })
          const to = PUBLIC_URL + '/content/layouts/' + layoutId

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
    [PUBLIC_URL, view, t, layoutId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
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
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {() => renderForm()}
    </Formik>
  )
}
