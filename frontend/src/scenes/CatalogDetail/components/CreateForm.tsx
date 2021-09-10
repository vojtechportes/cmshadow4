import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Select, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { CatalogItemTemplatesApi } from 'api/CatalogItemTemplates'
import { navigate } from '@reach/router'
import { CatalogItemTemplate } from 'model/api/CatalogItemTemplate'
import { CatalogItemsApi } from 'api/CatalogItems'
import { CatalogItemTemplateFieldValuesApi } from 'api/CatalogItemTemplateFieldValues'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  template_id?: number
}
export const FormSchema = Yup.object().shape<FormValues>({
  template_id: Yup.number().required(),
})

export const CreateForm: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-detail')
  const [templates, setTemplates] = useState<CatalogItemTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = {
    template_id: undefined,
  }

  const getTemplates = useCallback(async (cancelToken: CancelToken) => {
    setLoading(true)
    const { data } = await CatalogItemTemplatesApi.getAllCatalogItemTemplates({
      cancelToken,
    })

    setTemplates(data)
    setLoading(false)
  }, [])

  const handleSubmit = useCallback(
    async ({ template_id }: FormValues) => {
      console.log('submit')
      try {
        setLoading(true)
        const itemData = new FormData()

        itemData.append('template_id', String(template_id))

        const {
          data: { id: itemId },
        } = await CatalogItemsApi.createCatalogItem(itemData, {
          cancelToken: cancelTokenRef.current.token,
        })

        const valuesData = new FormData()

        valuesData.append('item_id', String(itemId))

        await CatalogItemTemplateFieldValuesApi.updateCatalogItemTemplateFieldValues(
          template_id,
          valuesData,
          {
            cancelToken: cancelTokenRef.current.token,
          }
        )

        navigate(PUBLIC_URL + '/catalog/' + itemId)

        notification.success({
          message: t('create.form.create-success'),
        })
      } catch (e) {
        console.log(e)
        setLoading(false)
      }
    },
    [PUBLIC_URL, t]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('create.form.template')} name="template_id">
          <Select name="template_id">
            {templates.map(({ id, name }) => (
              <Option value={id} key={id}>
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
            {t('create.form.submit')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, templates, loading]
  )

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    getTemplates(cancelToken.token)

    return () => cancelToken.cancel()
  }, [getTemplates])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <Formik<FormValues>
      initialValues={formInitialValues}
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {() => renderForm()}
    </Formik>
  )
}
