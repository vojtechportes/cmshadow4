import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik, FormikProps } from 'formik'
import { Input, Select, Switch, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Tag, Space, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { CatalogItemTemplateFieldsApi } from 'api/CatalogItemTemplateFields'
import { CatalogItemTemplateFieldTypeEnum } from 'model/api/CatalogItemTemplateFieldTypeEnum'
import {
  mapCatalogTemplateField,
  MappedCatalogTemplateField,
} from '../utils/mapCatalogTemplateField'
import { CATALOG_FIELD_TYPE_COLORS } from 'constants/colors'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  template_group_id?: number | null
  is_multilingual: boolean
  name?: string
  key?: string
  type?: CatalogItemTemplateFieldTypeEnum
  default_value?: string
  use_in_listing: boolean
  is_sortable: boolean
  is_searchable: boolean
  weight: number
}

export const FormSchema = Yup.object().shape<FormValues>({
  template_group_id: Yup.number()
    .nullable()
    .notRequired(),
  is_multilingual: Yup.boolean().required(),
  name: Yup.string().required(),
  key: Yup.string().matches(/^[A-Za-z0-9_.]+$/).required(),
  type: Yup.mixed().required(),
  default_value: Yup.string().notRequired(),
  use_in_listing: Yup.boolean().required(),
  is_sortable: Yup.boolean().required(),
  is_searchable: Yup.boolean().required(),
  weight: Yup.number().required(),
})

export interface FormProps {
  catalogItemTemplateId?: number
  catalogItemTemplateFieldId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({
  catalogItemTemplateId,
  catalogItemTemplateFieldId,
  view,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-template-field-detail')
  const [data, setData] = useState<MappedCatalogTemplateField>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues: FormValues = data || {
    template_group_id: null,
    is_multilingual: false,
    name: undefined,
    key: undefined,
    type: undefined,
    default_value: '',
    use_in_listing: false,
    is_sortable: false,
    is_searchable: false,
    weight: 50,
  }
  const submitFormSource = useRef<'create' | 'create-another'>()

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (
        view === 'detail' &&
        catalogItemTemplateId &&
        catalogItemTemplateFieldId
      ) {
        setLoading(true)

        const {
          data,
        } = await CatalogItemTemplateFieldsApi.getCatalogItemTemplateField(
          catalogItemTemplateId,
          catalogItemTemplateFieldId,
          { cancelToken }
        )
        setData(mapCatalogTemplateField(data))
        setLoading(false)
      }
    },
    [view, catalogItemTemplateId, catalogItemTemplateFieldId]
  )

  const handleSubmit = useCallback(
    async ({
      is_multilingual,
      default_value,
      name,
      key,
      type,
      is_searchable,
      is_sortable,
      use_in_listing,
      weight,
    }: FormValues) => {
      setLoading(true)
      const data = new FormData()

      data.append('type', String(type))
      data.append('name', name)
      data.append('key', key)
      data.append('is_multilingual', String(+is_multilingual))
      data.append('default_value', String(default_value))
      data.append('is_searchable', String(+is_searchable))
      data.append('is_sortable', String(+is_sortable))
      data.append('use_in_listing', String(+use_in_listing))
      data.append('weight', String(weight))

      if (view === 'new') {
        try {
          await CatalogItemTemplateFieldsApi.createCatalogItemTemplateField(
            catalogItemTemplateId,
            data,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          if (submitFormSource.current === 'create') {
            navigate(PUBLIC_URL + '/catalog/templates/' + catalogItemTemplateId)
          } else {
            const to =
              PUBLIC_URL +
              '/catalog/templates/' +
              catalogItemTemplateId +
              '/fields/new'

            navigate(PUBLIC_URL + '/redirect-to', {
              state: {
                to,
              },
            })
          }

          notification.success({
            message: t('form.create-success'),
          })
        } catch (e) {
          setLoading(false)
        }
      } else if (view === 'detail') {
        try {
          await CatalogItemTemplateFieldsApi.updateCatalogItemTemplateField(
            catalogItemTemplateId,
            catalogItemTemplateFieldId,
            data,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({
            message: t('form.update-success'),
          })
        } catch (e) {}

        setLoading(false)
      }
    },
    [PUBLIC_URL, view, catalogItemTemplateId, catalogItemTemplateFieldId, t]
  )

  const handleSubmitForm = useCallback(
    (
      source: 'create' | 'create-another',
      submitForm: (() => Promise<void>) & (() => Promise<any>)
    ) => {
      submitFormSource.current = source
      submitForm()
    },
    []
  )

  const renderForm = useCallback(
    ({ submitForm }: FormikProps<FormValues>) => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.type')} name="type">
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Select name="type">
              {Object.keys(CatalogItemTemplateFieldTypeEnum).map(
                (item: string) => (
                  <Option value={item} key={item}>
                    <Tag color={CATALOG_FIELD_TYPE_COLORS[item]}>
                      {t(`enum:${item}`)}
                    </Tag>
                  </Option>
                )
              )}
            </Select>
            {view === 'detail' && (
              <Alert type="warning" message={t('form.type-warning')} />
            )}
          </Space>
        </Item>

        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.key')} name="key">
          <Input name="key" />
        </Item>
        <Item label={t('form.default-value')} name="default_value">
          <Input name="default_value" />
        </Item>
        <Item label={t('form.is-multilingual')} name="is_multilingual">
          <Switch name="is_multilingual" />
        </Item>
        <Item label={t('form.use-in-listing')} name="use_in_listing">
          <Switch name="use_in_listing" />
        </Item>
        <Item label={t('form.is-sortable')} name="is_sortable">
          <Switch name="is_sortable" />
        </Item>
        <Item label={t('form.is-searchable')} name="is_searchable">
          <Switch name="is_searchable" />
        </Item>
        <Item label={t('form.weight')} name="weight">
          <Input name="weight" type="number" />
        </Item>

        <ItemAntd>
          {view === 'new' ? (
            <Space size="middle" direction="horizontal">
              <Button
                htmlType="button"
                type="primary"
                size="large"
                disabled={loading}
                onClick={() => handleSubmitForm('create', submitForm)}
              >
                {t('form.submit.new.create')}
              </Button>
              <Button
                htmlType="button"
                type="default"
                size="large"
                disabled={loading}
                onClick={() => handleSubmitForm('create-another', submitForm)}
              >
                {t('form.submit.new.create-and-create-another')}
              </Button>
            </Space>
          ) : (
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              disabled={loading}
            >
              {t('form.submit.detail')}
            </Button>
          )}
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, view, loading, handleSubmitForm]
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
      {props => renderForm(props)}
    </Formik>
  )
}
