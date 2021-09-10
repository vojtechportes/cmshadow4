import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Input, Select, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import { ViewsApi } from 'api/Views'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { View } from 'model/api/View'
import { CatalogItemTemplatesApi } from 'api/CatalogItemTemplates'
import { navigate } from '@reach/router'
import { CatalogItemTemplate } from 'model/api/CatalogItemTemplate'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  view_id?: number
  view_id_name?: string
  name?: string
  path?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  view_id: Yup.number().required(),
  name: Yup.string().required(),
  path: Yup.string().required(),
})

export interface DetailDataProps extends CatalogItemTemplate {
  view_id_name?: string
}

export interface FormProps {
  catalogItemTemplateId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ catalogItemTemplateId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-template-detail')
  const [views, setViews] = useState<View[]>([])
  const [data, setData] = useState<DetailDataProps>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = data || {
    view_id: undefined,
    view_id_name: undefined,
    name: undefined,
    path: undefined,
  }

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && catalogItemTemplateId) {
        setLoading(true)

        const {
          data,
        } = await CatalogItemTemplatesApi.getCatalogItemTemplate(
          catalogItemTemplateId,
          { cancelToken }
        )

        const {
          data: { name: view_id_name },
        } = await ViewsApi.getView(data.view_id, { cancelToken })

        setData({ view_id_name, ...data })
        setLoading(false)
      }
    },
    [view, catalogItemTemplateId]
  )

  const getViews = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'new') {
        setLoading(true)

        const { data } = await ViewsApi.getAllViews({
          cancelToken,
        })

        setViews(data)
        setLoading(false)
      }
    },
    [view]
  )

  const handleSubmit = useCallback(
    async ({ view_id, name, path }: Required<FormValues>) => {
      setLoading(true)
      const data = new FormData()

      if (view === 'new') {
        data.append('view_id', String(view_id))
      }

      data.append('name', name)
      data.append('path', path)

      if (view === 'new') {
        const {
          data: { id },
        } = await CatalogItemTemplatesApi.createCatalogItemTemplate(data, {
          cancelToken: cancelTokenRef.current.token,
        })

        setLoading(false)

        notification.success({
          message: t('form.create-success')
        })

        navigate(PUBLIC_URL + '/catalog/templates/' + id)
      } else if (view === 'detail') {
        await CatalogItemTemplatesApi.updateCatalogItemTemplate(
          catalogItemTemplateId,
          data,
          {
            cancelToken: cancelTokenRef.current.token,
          }
        )

        notification.success({
          message: t('form.update-success')
        })

        setLoading(false)
      }
    },
    [PUBLIC_URL, view, catalogItemTemplateId, t]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.view-id')} name="view_id">
          {view === 'new' ? (
            <Select name="view_id" loading={loading}>
              {views.map(({ id, name }) => (
                <Option value={id} key={id}>
                  {name}
                </Option>
              ))}
            </Select>
          ) : (
            <Input name="view_id_name" disabled />
          )}
        </Item>
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.path')} name="path">
          <Input name="path" />
        </Item>
        <div />
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
    [t, view, views, loading]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getViews(cancelTokenSource.token)
    getData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getViews, getData])

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
