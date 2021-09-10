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
import { Button as ButtonInterface } from 'model/api/Button'
import { ButtonsApi } from 'api/Buttons'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  name?: string
  class_name?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  class_name: Yup.string().required(),
})

export interface FormProps {
  buttonId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ buttonId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('button-detail')
  const [data, setData] = useState<ButtonInterface>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    name: undefined,
    class_name: undefined,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && buttonId) {
        try {
          setLoading(true)

          const { data } = await ButtonsApi.getButton(buttonId, {
            cancelToken,
          })

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, buttonId]
  )

  const handleSubmit = useCallback(
    async ({ name, class_name }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('class_name', class_name)

        if (view === 'new') {
          await ButtonsApi.createButton(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/modules/buttons')
        } else if (view === 'detail' && buttonId) {
          await ButtonsApi.updateButton(buttonId, formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/modules/buttons')
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, buttonId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.class-name')} name="class_name">
          <Input name="class_name" />
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
