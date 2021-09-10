import React, { useCallback, useEffect, useRef, useContext } from 'react'
import { Formik } from 'formik'
import { Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { NavigationDetailContext } from '../'
import { NavigationsApi } from 'api/Navigations'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  name?: string
  path?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  path: Yup.string().required(),
})

export const Form: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-detail')
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const { view, navigationId, navigation, loading, setLoading } = useContext(
    NavigationDetailContext
  )
  const formInitialValues = navigation || {
    name: undefined,
    path: undefined,
  }

  const handleSubmit = useCallback(
    async ({ name, path }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('path', path)

        if (view === 'new') {
          const {
            data: { id },
          } = await NavigationsApi.createNavigation(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/modules/navigations/' + id)
        } else if (view === 'detail' && navigationId) {
          await NavigationsApi.updateNavigation(navigationId, formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/modules/navigations/' + navigationId)
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, navigationId, setLoading]
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
