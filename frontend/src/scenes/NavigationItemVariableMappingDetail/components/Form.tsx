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
import { NavigationsItemVariableMappingsApi } from 'api/NavigationItemVariableMappings'
import { NavigationItemVariableMapping } from 'model/api/NavigationItemVariableMapping'

const { Item: ItemAntd } = FormAntd

export interface FormValues {
  variable_name?: string
  value?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  variable_name: Yup.string().required(),
  value: Yup.string().required(),
})

export interface FormProps {
  navigationId: number
  navigationItemId: number
  navigationItemVariableMappingId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({
  navigationId,
  navigationItemId,
  navigationItemVariableMappingId,
  view,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-item-variable-item-mapping-detail')
  const [data, setData] = useState<NavigationItemVariableMapping>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    variable_name: undefined,
    value: undefined,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && navigationItemVariableMappingId) {
        try {
          setLoading(true)

          const {
            data,
          } = await NavigationsItemVariableMappingsApi.getNavigationItemVariableMapping(
            navigationId,
            navigationItemId,
            navigationItemVariableMappingId,
            {
              cancelToken,
            }
          )

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, navigationId, navigationItemId, navigationItemVariableMappingId]
  )

  const handleSubmit = useCallback(
    async ({ variable_name, value }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('variable_name', variable_name)
        formData.append('value', value)

        if (view === 'new') {
          await NavigationsItemVariableMappingsApi.createNavigationItemVariableMapping(
            navigationId,
            navigationItemId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('create-success') })
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              navigationItemId +
              '/mappings'
          )
        } else if (view === 'detail' && navigationItemVariableMappingId) {
          await NavigationsItemVariableMappingsApi.updateNavigationItemVariableMapping(
            navigationId,
            navigationItemId,
            navigationItemVariableMappingId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('update-success') })
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              navigationItemId +
              '/mappings'
          )
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [
      PUBLIC_URL,
      view,
      t,
      navigationId,
      navigationItemId,
      navigationItemVariableMappingId,
    ]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.variable-name')} name="variable_name">
          <Input name="variable_name" />
        </Item>
        <Item label={t('form.value')} name="value">
          <Input name="value" />
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
