import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik, FormikProps } from 'formik'
import { Input, Form as FormFormikAntd, Select } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { EmailTemplate as EmailTemplateInterface } from 'model/api/EmailTemplate'
import { EmailTemplatesApi } from 'api/EmailTemplates'
import { EmailTemplateTypeEnum } from 'model/api/EmailTemplateTypeEnum'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { iterableEnum } from 'utils/iterableEnum'

const { Item: ItemAntd } = FormAntd
const { Option } = Select
const { TextArea } = Input

export interface FormValues {
  type?: EmailTemplateTypeEnum
  content?: string
  language?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  type: Yup.mixed().required(),
  content: Yup.string().required(),
  language: Yup.string().required(),
})

export interface FormProps {
  emailTemplateId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({ emailTemplateId, view }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('email-template-detail')
  const [data, setData] = useState<EmailTemplateInterface>()
  const [catalogLanguages, setCatalogLanguages] = useState<CatalogLanguage[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    type: undefined,
    content: undefined,
    language: undefined,
  }

  const getCatalogLanguages = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
      cancelToken,
    })

    setCatalogLanguages(data)
  }, [])

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && emailTemplateId) {
        try {
          setLoading(true)

          const { data } = await EmailTemplatesApi.getEmailTemplate(
            emailTemplateId,
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
    [view, emailTemplateId]
  )

  const handleSubmit = useCallback(
    async ({ type, content, language }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()
        formData.append('type', String(type))
        formData.append('content', content)
        formData.append('language', language)

        if (view === 'new') {
          await EmailTemplatesApi.createEmailTemplate(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/email-templates')
        } else if (view === 'detail' && emailTemplateId) {
          await EmailTemplatesApi.updateEmailTemplate(
            emailTemplateId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/email-templates')
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, emailTemplateId]
  )

  const renderForm = useCallback(
    ({ values: { type } }: FormikProps<FormValues>) => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.type')} name="type">
          <Select name="type">
            {Object.keys(iterableEnum(EmailTemplateTypeEnum)).map(value => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.content.label')} name="name">
          <TextArea name="content" rows={14} />
          {type && String(type).startsWith('ORDER_') && (
            <Alert
              type="info"
              message={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t('form.content.type-order-note'),
                  }}
                />
              }
            />
          )}
        </Item>
        <Item label={t('form.language')} name="language">
          <Select name="language">
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
    [t, view, catalogLanguages, loading]
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
      {props => renderForm(props)}
    </Formik>
  )
}
