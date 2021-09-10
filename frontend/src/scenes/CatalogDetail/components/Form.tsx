import React, { useCallback, useContext, useRef, useEffect } from 'react'
import { useGetInitialValues } from '../hooks/useGetInitialValues'
import { CatalogDetailContext } from '..'
import axios, { CancelTokenSource } from 'axios'
import { CatalogItemTemplateFieldValuesApi } from 'api/CatalogItemTemplateFieldValues'
import { CatalogItemsApi } from 'api/CatalogItems'
import { objectToFormData } from 'object-to-formdata'
import { Button, Form as FormAntd, notification } from 'antd'
import { validateSchema } from 'config/yup'
import { navigate } from '@reach/router'
import { Formik } from 'formik'
import { Form as FormFormikAntd } from 'formik-antd'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Data } from './Data'
import { Tabs } from 'antd'
import { Categories } from './Categories'
import { CatalogItemCategoriesApi } from 'api/CatalogItemCategories'

const { TabPane } = Tabs
const { Item: ItemAntd } = FormAntd

export enum CatalogTabsEnum {
  DATA = 'Data',
  CATEGORIES = 'Categories',
}

export interface FormValues {}
export const FormSchema = Yup.object().shape<FormValues>({})

export const Form = () => {
  const { t } = useTranslation('catalog-detail')
  const { data, loading, setLoading } = useContext(CatalogDetailContext)
  const formInitialValues = useGetInitialValues()
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const { PUBLIC_URL } = process.env

  const handleSubmit = useCallback(
    // TODO type values
    async (values: any) => {
      const cancelToken = cancelTokenRef.current.token

      if (data) {
        try {
          setLoading(true)
          const transformedValues = { fields: {} }

          Object.keys(values.fields).forEach(key => {
            if (Object.keys(values.fields[key])[0] !== 'value') {
              Object.keys(values.fields[key]).forEach(language => {
                let newValue = values.fields[key][language]

                if (typeof newValue.value === 'object') {
                  newValue = {
                    ...newValue,
                    value: JSON.stringify(newValue.value),
                  }
                }

                if (typeof newValue.images !== 'undefined') {
                  newValue = {
                    ...newValue,
                    images: newValue.images.map(image => image.originFileObj),
                  }
                }

                if (typeof newValue.image !== 'undefined') {
                  newValue = {
                    ...newValue,
                    image: newValue.image.originFileObj,
                  }
                }

                if (!transformedValues.fields[key]) {
                  transformedValues.fields[key] = {}
                }
                transformedValues.fields[key][language] = newValue
              })
            } else {
              let newValue = values.fields[key]

              if (typeof newValue.value === 'object') {
                newValue = {
                  ...newValue,
                  value: JSON.stringify(newValue.value),
                }
              }

              if (typeof newValue.images !== 'undefined') {
                newValue = {
                  ...newValue,
                  images: newValue.images.map(image => image.originFileObj),
                }
              }

              if (typeof newValue.image !== 'undefined') {
                newValue = {
                  ...newValue,
                  image: newValue.image.originFileObj,
                }
              }

              transformedValues.fields[key] = newValue
            }
          })

          const formData = objectToFormData(transformedValues, {
            nullsAsUndefineds: true,
            booleansAsIntegers: true,
          })

          formData.append('item_id', String(data.id))

          const categoriesFormData = new FormData()

          values.categories.forEach(category => {
            if (typeof category === 'object') {
              category = category.value
            }

            categoriesFormData.append('category[]', String(category))
          })

          await CatalogItemTemplateFieldValuesApi.updateCatalogItemTemplateFieldValues(
            data.template_id,
            formData,
            { cancelToken }
          )

          await CatalogItemCategoriesApi.setCatalogItemCategories(
            categoriesFormData,
            data.id,
            {
              cancelToken,
            }
          )

          await CatalogItemsApi.updateCatalogItem(data.id, new FormData(), {
            cancelToken,
          })

          const to = PUBLIC_URL + '/catalog/' + data.id

          navigate(PUBLIC_URL + '/redirect-to', {
            state: {
              to,
            },
          })

          notification.success({ message: t('save-success') })
          setLoading(false)
        } catch (e) {
          console.log(e)
          setLoading(false)
        }
      }
    },
    [data, PUBLIC_URL, t, setLoading]
  )

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  console.log(formInitialValues)

  return (
    <Formik<any>
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      <FormFormikAntd layout="vertical">
        <Tabs defaultActiveKey={CatalogTabsEnum.DATA}>
          <TabPane tab={t('tabs.data')} key={CatalogTabsEnum.DATA}>
            <Data />
          </TabPane>
          <TabPane tab={t('tabs.categories')} key={CatalogTabsEnum.CATEGORIES}>
            <Categories />
          </TabPane>
        </Tabs>
        <ItemAntd>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={loading}
          >
            {t('detail.form.submit')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    </Formik>
  )
}
