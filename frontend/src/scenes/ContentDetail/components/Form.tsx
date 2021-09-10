import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Input, Select, Form as FormFormikAntd, TreeSelect } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import { PagesApi } from 'api/Pages'
import axios, { CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { useGetPropertiesData } from '../hooks/useGetPropertiesData'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  parent?: string
  name?: string
  template_id?: number
  path?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  parent: Yup.string().notRequired(),
  name: Yup.string().required(),
  template_id: Yup.number().required(),
  path: Yup.string().required(),
})

export interface FormProps {
  pageIdentifier?: string
  parent?: string
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ parent, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('content-detail')
  const { pages, templates, loading: propsDataLoading } = useGetPropertiesData()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = {
    parent: parent ? parent : '',
    name: undefined,
    template_id: undefined,
    path: undefined,
  }

  const handleSubmit = useCallback(
    async ({
      name,
      parent: parentIdentifier,
      path,
      template_id,
    }: Required<FormValues>) => {
      setLoading(true)
      const data = new FormData()
      data.append('name', name)
      data.append('parent', parentIdentifier)
      data.append('path', path)
      data.append('template_id', String(template_id))

      if (view === 'new') {
        const {
          data: { identifier },
        } = await PagesApi.createPage(data, {
          cancelToken: cancelTokenRef.current.token,
        })

        setLoading(false)

        notification.success({
          message: t('form.create-success'),
        })

        navigate(PUBLIC_URL + '/content/' + identifier)
      }
    },
    [PUBLIC_URL, view, t]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.tempalte-id')} name="template_id">
          <Select name="template_id" loading={loading || propsDataLoading}>
            {templates.map(({ id, name }) => (
              <Option value={id} key={id}>
                {name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.parent')} name="parent">
          {pages ? (
            <TreeSelect
              treeData={pages}
              name="parent"
              allowClear
              showArrow
              showSearch
              filterTreeNode
              treeDefaultExpandAll
              treeNodeFilterProp="title"
            />
          ) : (
            <Input name="parent" disabled />
          )}
        </Item>
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
            {t('form.submit.new')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, templates, pages, loading, propsDataLoading]
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
