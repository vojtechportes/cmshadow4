import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik, FormikProps } from 'formik'
import { Input, Form as FormFormikAntd, TreeSelect } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { navigate } from '@reach/router'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { CatalogCategoryDetail } from 'model/api/CatalogCategoryDetail'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'
import { objectToFormData } from 'object-to-formdata'
import { FieldGroup } from 'scenes/CatalogDetail/components/Fields/styles'
import { RichTextFormik } from 'components/RichTextFormik'

const { Item: ItemAntd } = FormAntd

export interface CatalogCategory {}

export interface FormValuesValue {
  name?: string
  description?: string
}

export interface FormValues {
  name?: string
  parent_id?: number | null
  weight: number
  values?: Array<{
    [key: string]: FormValuesValue
  }>
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  parent_id: Yup.number().nullable(),
  weight: Yup.number(),
})

export interface FormProps {
  catalogCategoryId?: number
  parentId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({
  catalogCategoryId,
  parentId,
  view,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-category-detail')
  const [languages, setLanguages] = useState<CatalogLanguage[]>()
  const [data, setData] = useState<CatalogCategoryDetail>()
  const [categories, setCategories] = useState<MappedCatalogCategory[]>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const submitFormSource = useRef<'create' | 'create-another'>()

  const getInitialValues = useCallback(() => {
    if (languages) {
      const languageValues = languages.map(({ code }) => ({
        [code]: {
          name: undefined,
          description: undefined,
        },
      }))

      if (view === 'detail' && data) {
        return {
          name: data.name,
          parent_id: data.parent_id || 0,
          weight: data.weight,
          values: {
            ...languageValues,
            ...data.data,
          },
        } as FormValues
      } else {
        return {
          name: undefined,
          parent_id: parentId || 0,
          weight: 50,
          values: languageValues,
        } as FormValues
      }
    }
  }, [data, languages, parentId, view])

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && catalogCategoryId) {
        try {
          setLoading(true)

          const { data } = await CatalogCategoriesApi.getCatalogCategory(
            catalogCategoryId,
            undefined,
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
    [view, catalogCategoryId]
  )

  const getCatalogCategories = useCallback(
    async (cancelToken: CancelToken) => {
      try {
        setLoading(true)
        const { data } = await CatalogCategoriesApi.getCatalogCategories(
          undefined,
          undefined,
          undefined,
          undefined,
          {
            cancelToken,
          }
        )

        setCategories(mapCatalogCategories(data, t))
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    },
    [t]
  )

  const getLanguages = useCallback(async (cancelToken: CancelToken) => {
    try {
      setLoading(true)

      const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
        cancelToken,
      })

      setLanguages(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [])

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

  const handleSubmit = useCallback(
    async (data: Required<FormValues>) => {
      try {
        setLoading(true)

        if (data.parent_id === 0) {
          delete data.parent_id
        }

        const formData = objectToFormData(data, { booleansAsIntegers: true })

        if (view === 'new') {
          await CatalogCategoriesApi.createCatalogCategory(formData, {
            cancelToken: cancelTokenRef.current.token,
          })

          notification.success({ message: t('create-success') })

          if (submitFormSource.current === 'create') {
            navigate(PUBLIC_URL + '/catalog/categories')
          } else {
            let to = PUBLIC_URL + '/catalog/categories/new'

            if (data.parent_id) {
              to = to + '?parentId=' + data.parent_id
            }

            navigate(PUBLIC_URL + '/redirect-to', {
              state: {
                to,
              },
            })
          }
        } else if (view === 'detail' && catalogCategoryId) {
          await CatalogCategoriesApi.updateCatalogCategory(
            catalogCategoryId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/catalog/categories')
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, catalogCategoryId]
  )

  const renderForm = useCallback(
    ({ submitForm }: FormikProps<FormValues>) => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('form.parent')} name="parent_id">
          {categories ? (
            <TreeSelect
              style={{ width: '100%' }}
              name="parent_id"
              defaultActiveFirstOption
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={categories}
              placeholder="Please select"
              treeDefaultExpandAll
            />
          ) : (
            <Input name="parent_id" disabled={loading} />
          )}
        </Item>
        <Item label={t('form.weight')} name="weight">
          <Input name="weight" type="number" />
        </Item>
        {languages &&
          languages.map(({ code, name }) => (
            <FieldGroup key={code}>
              <Item
                label={t('form.name-localized', { language: name })}
                name={`values[${code}][name]`}
              >
                <Input name={`values[${code}][name]`} />
              </Item>
              <Item
                label={t('form.description-localized', { language: name })}
                name={`values[${code}][description]`}
              >
                <RichTextFormik name={`values[${code}][description]`} />
              </Item>
            </FieldGroup>
          ))}
        <ItemAntd>
          {view === 'new' ? (
            <Space size="middle" direction="horizontal">
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                disabled={loading}
                onClick={() => handleSubmitForm('create', submitForm)}
              >
                {t('form.submit.new')}
              </Button>
              <Button
                htmlType="button"
                type="default"
                size="large"
                disabled={loading}
                onClick={() => handleSubmitForm('create-another', submitForm)}
              >
                {t('form.submit.create-and-create-another')}
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
    [t, view, categories, languages, loading, handleSubmitForm]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getLanguages(cancelTokenSource.token)
    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getLanguages, getCatalogCategories])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <Formik<FormValues>
      initialValues={getInitialValues()}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {props => renderForm(props)}
    </Formik>
  )
}
