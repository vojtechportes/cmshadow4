import React, { useCallback, useState, useEffect } from 'react'
import { Collapse, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'
import axios, { CancelToken } from 'axios'
import { Input, TreeSelect } from 'formik-antd'
import { TreeSelect as TreeSelectAntd } from 'antd'
import { Form as FormFormikAntd } from 'formik-antd'
import { Form as FormAntd } from 'antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'

const { SHOW_ALL } = TreeSelectAntd
const { Item: ItemAntd } = FormAntd
const { Panel } = Collapse

export interface FiltersValues {
  name?: string
  sku?: string
  categories?: Array<{ value: number; label: string }>
}

export interface SubmittedFilterValues {
  name?: string
  sku?: string
  categories?: number[]
}

export const filtersInitialValues: FiltersValues = {
  name: undefined,
  sku: undefined,
  categories: undefined,
}

export interface FiltersProps {
  onSubmit: (values: SubmittedFilterValues) => void
}

export const Filters: React.FC<FiltersProps> = ({ onSubmit }) => {
  const { t } = useTranslation('catalog')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<MappedCatalogCategory[]>()

  const handleSubmit = useCallback(
    ({ name, sku, categories }: FiltersValues) => {
      const categoryIds = []

      categories &&
        categories.forEach(item => {
          categoryIds.push(item.value)
        })

      onSubmit({ categories: categoryIds, name, sku })
    },
    [onSubmit]
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

        setCategories(mapCatalogCategories(data, t, false))
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    },
    [t]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('filters.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('filters.sku')} name="sku">
          <Input name="sku" />
        </Item>
        <Item label={t('filters.categories')} name="categories">
          {categories ? (
            <TreeSelect
              treeData={categories}
              name="categories"
              showCheckedStrategy={SHOW_ALL}
              treeCheckable
              treeCheckStrictly
              treeDefaultExpandAll
              showArrow
              allowClear
              filterTreeNode
              treeNodeFilterProp="title"
            />
          ) : (
            <Input name="categories" disabled />
          )}
        </Item>

        <ItemAntd>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={loading}
          >
            {t('filters.submit')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [categories, loading, t]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogCategories])

  return (
    <Collapse>
      <Panel header={t('filters.title')} key="filters">
        <Formik<FiltersValues>
          initialValues={filtersInitialValues}
          onSubmit={handleSubmit}
        >
          {() => renderForm()}
        </Formik>
      </Panel>
    </Collapse>
  )
}
