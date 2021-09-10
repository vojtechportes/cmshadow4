import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Select, Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { View } from 'model/api/View'
import { ViewsApi } from 'api/Views'
import { TemplatesApi } from 'api/Templates'
import { Layout } from 'model/api/Layout'
import { LayoutsApi } from 'api/Layouts'
import {
  MappedTemplateDetail,
  mapTemplateDetail,
} from '../utils/mapTemplateDetail'
import { TemplatePage } from 'model/api/TemplatePage'
import { TemplatePagesApi } from 'api/TemplatePages'

const { Item: ItemAntd } = FormAntd
const { TextArea } = Input
const { Option } = Select

export interface CatalogCategory {}

export interface FormValues {
  layout_id?: number
  view_id?: number
  name?: string
  html_head_end?: string
  html_body_start?: string
  html_body_end?: string
  template_pages?: number[]
}

export const FormSchema = Yup.object().shape<FormValues>({
  layout_id: Yup.number().required(),
  view_id: Yup.number().required(),
  name: Yup.string().required(),
  html_head_end: Yup.string().notRequired(),
  html_body_start: Yup.string().notRequired(),
  html_body_end: Yup.string().notRequired(),
  template_pages: Yup.array().of(Yup.number()),
})

export interface FormProps {
  templateId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ templateId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('template-detail')
  const [data, setData] = useState<MappedTemplateDetail>()
  const [views, setViews] = useState<View[]>([])
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [templatePages, setTemplatePages] = useState<TemplatePage[]>([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = data || {
    name: undefined,
    view_id: undefined,
    layout_id: undefined,
    html_head_end: '',
    html_body_start: '',
    html_body_end: '',
    template_pages: undefined,
  }


  const getTemplatePages = useCallback(
    async (layoutId: number, cancelToken: CancelToken) => {
      if (view === 'detail') {
        try {
          setLoading(true)

          const { data } = await TemplatePagesApi.getAllTemplatePages(layoutId, {
            cancelToken,
          })

          setTemplatePages(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view]
  )

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && templateId) {
        try {
          setLoading(true)

          const { data } = await TemplatesApi.getTemplate(templateId, {
            cancelToken,
          })

          await getTemplatePages(data.layout_id, cancelToken)

          setData(mapTemplateDetail(data))
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, templateId, getTemplatePages]
  )

  const getViews = useCallback(async (cancelToken: CancelToken) => {
    try {
      setLoading(true)

      const { data } = await ViewsApi.getAllViews({ cancelToken })

      setViews(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [])

  const getLayouts = useCallback(async (cancelToken: CancelToken) => {
    try {
      setLoading(true)

      const { data } = await LayoutsApi.getAllLayouts({ cancelToken })

      setLayouts(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(
    async ({
      name,
      view_id,
      layout_id,
      html_head_end,
      html_body_end,
      html_body_start,
      template_pages,
    }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('view_id', String(view_id))
        formData.append('layout_id', String(layout_id))
        formData.append('html_head_end', html_head_end)
        formData.append('html_body_end', html_body_end)
        formData.append('html_body_start', html_body_start)

        if (view === 'new') {
          const {
            data: { id },
          } = await TemplatesApi.createTemplate(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('form.create-success') })
          navigate(PUBLIC_URL + '/content/templates/' + id)
        } else if (view === 'detail' && templateId) {
          template_pages.forEach(id => {
            formData.append('template_pages[]', String(id))
          })

          await TemplatesApi.updateTemplate(templateId, formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('form.update-success') })

          const to = PUBLIC_URL + '/content/templates/' + templateId

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
    [PUBLIC_URL, view, t, templateId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.layout-id')} name="layout_id">
          <Select name="layout_id">
            {layouts.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.view-id')} name="view_id">
          <Select name="view_id">
            {views.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.html-head-end')} name="html_head_end">
          <TextArea name="html_head_end" rows={3} />
        </Item>
        <Item label={t('form.html-body-start')} name="html_body_start">
          <TextArea name="html_body_start" rows={3} />
        </Item>
        <Item label={t('form.html-body-end')} name="html_body_end">
          <TextArea name="html_body_end" rows={3} />
        </Item>
        {view === 'detail' && (
          <Item label={t('form.template-pages')} name="template_pages">
            <Select name="template_pages" mode="multiple">
              {templatePages.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          </Item>
        )}
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
    [t, view, views, layouts, templatePages, loading]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getViews(cancelTokenSource.token)
    getLayouts(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getViews, getLayouts])

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
