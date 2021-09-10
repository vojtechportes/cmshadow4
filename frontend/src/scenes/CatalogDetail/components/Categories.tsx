import React, { useCallback, useContext, useState, useEffect } from 'react'
import { TreeSelect, Input } from 'formik-antd'
import { TreeSelect as TreeSelectAntd } from 'antd'
import axios, { CancelToken } from 'axios'
import { CatalogDetailContext } from '..'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import { useTranslation } from 'react-i18next'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'
import { FormikFormItem as Item } from 'components/FormikFormItem'

const { SHOW_ALL } = TreeSelectAntd

export const Categories: React.FC = () => {
  const { t } = useTranslation('catalog-detail')
  const { setLoading } = useContext(CatalogDetailContext)
  const [categories, setCategories] = useState<MappedCatalogCategory[]>()

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
    [t, setLoading]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogCategories])

  return (
    <Item label={t('categories.categories')} name="categories">
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
  )
}
