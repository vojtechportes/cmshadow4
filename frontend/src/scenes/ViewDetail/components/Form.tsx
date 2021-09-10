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
import { View } from 'model/api/View'
import { ViewsApi } from 'api/Views'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  name?: string
  path?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  path: Yup.string().required(),
})

export interface FormProps {
  viewId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ viewId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('view-detail')
  const [data, setData] = useState<View>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    name: undefined,
    path: undefined,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && viewId) {
        try {
          setLoading(true)

          const { data } = await ViewsApi.getView(viewId, {
            cancelToken,
          })

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, viewId]
  )

  const handleSubmit = useCallback(
    async ({ name, path }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('path', path)

        if (view === 'new') {
          await ViewsApi.createView(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/views')
        } else if (view === 'detail' && viewId) {
          await ViewsApi.updateView(viewId, formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/views')
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, viewId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.path')} name="path">
          <Input name="path" />
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
