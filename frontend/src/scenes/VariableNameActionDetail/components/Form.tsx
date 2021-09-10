import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Input, Form as FormFormikAntd, Select } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { VariableNameActionsApi } from 'api/VariableNameActions'
import { VariableNameAction } from 'model/api/VariableNameAction'
import { VariableNameActionActionEnm } from 'model/api/VariableNameActionActionEnum'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  variable_name?: string
  path?: string
  language_code?: string
  action?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  variable_name: Yup.string().required(),
  path: Yup.string().required(),
  language_code: Yup.string(),
  action: Yup.string().required(),
})

export interface FormProps {
  variableNameActionId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ variableNameActionId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('variable-name-action-detail')
  const [data, setData] = useState<VariableNameAction>()
  const [loading, setLoading] = useState(false)
  const [catalogLanguages, setCatalogLanguages] = useState<CatalogLanguage[]>(
    []
  )
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    variable_name: undefined,
    path: undefined,
    action: undefined,
  }

  const getCatalogLanguages = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
      cancelToken,
    })

    setCatalogLanguages(data)
  }, [])

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && variableNameActionId) {
        try {
          setLoading(true)

          const { data } = await VariableNameActionsApi.getVariableNameAction(
            variableNameActionId,
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
    [view, variableNameActionId]
  )

  const handleSubmit = useCallback(
    async ({ variable_name, path, language_code, action }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('variable_name', variable_name)
        formData.append('path', path)
        formData.append('action', action)
        formData.append('language_code', language_code)

        if (view === 'new') {
          await VariableNameActionsApi.createVariableNameAction(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/variable-name-actions')
        } else if (view === 'detail' && variableNameActionId) {
          await VariableNameActionsApi.updateVariableNameAction(
            variableNameActionId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/variable-name-actions')
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, variableNameActionId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.variable-name')} name="variable_name">
          <Input name="variable_name" />
        </Item>
        <Item label={t('form.path')} name="path">
          <Input name="path" />
        </Item>
        <Item label={t('form.action')} name="action">
          <Select name="action">
            {Object.values(VariableNameActionActionEnm).map(value => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.catalog-language')} name="language_code">
          <Select name="language_code" allowClear>
            {catalogLanguages.map(({ code, name }) => (
              <Option key={code} value={code}>
                {name}
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
    [t, view, loading, catalogLanguages]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getCatalogLanguages(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getCatalogLanguages])

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
