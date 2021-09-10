import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form, TreeSelect, Input, Alert, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogCategoryTreeDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

export type Data = CatalogCategoryTreeDataProps

export interface ConfigurationProps {
  data: Data
  onConfirm: (data: Data) => void
  onCancel: () => void
}

const { Option } = Select
const { Item } = Form

export const Configuration: React.FC<ConfigurationProps> = ({
  data,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('content-detail')
  const [configuration, setConfiguration] = useState(data)
  const [languages, setLanguages] = useState<CatalogLanguage[]>()
  const [categories, setCategories] = useState<MappedCatalogCategory[]>()
  const [loading, setLoading] = useState(false)

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

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleParentCategoryChange = useCallback(
    (parent_category_id: number | null) => {
      setConfiguration(value => ({
        ...value,
        parent_category_id,
      }))
    },
    []
  )

  const handleDisplayIfParentCategoryChange = useCallback(
    (display_if_parent_category_id: number | null) => {
      setConfiguration(value => ({
        ...value,
        display_if_parent_category_id,
      }))
    },
    []
  )

  const handleLanguageCodeChange = useCallback(
    (language_code: string | null) => {
      setConfiguration(value => ({
        ...value,
        language_code,
      }))
    },
    []
  )

  const handleLinkPatternChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist()

      setConfiguration(value => ({
        ...value,
        link_pattern: event.target.value,
      }))
    },
    []
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getLanguages(cancelTokenSource.token)
    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getLanguages, getCatalogCategories])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('catalog-category-tree-configuration.title')}
    >
      <Form layout="vertical">
        <Item
          label={t('catalog-category-tree-configuration.parent-category-id')}
        >
          {categories ? (
            <TreeSelect
              style={{ width: '100%' }}
              defaultActiveFirstOption
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              defaultValue={configuration.parent_category_id}
              treeData={categories}
              onChange={handleParentCategoryChange}
              placeholder="Please select"
              treeDefaultExpandAll
            />
          ) : (
            <Input disabled={loading} />
          )}
        </Item>
        <Item
          label={t(
            'catalog-category-tree-configuration.display-if-parent-category-id'
          )}
        >
          {categories ? (
            <TreeSelect
              style={{ width: '100%' }}
              defaultActiveFirstOption
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              defaultValue={configuration.display_if_parent_category_id}
              treeData={categories}
              onChange={handleDisplayIfParentCategoryChange}
              placeholder="Please select"
              treeDefaultExpandAll
            />
          ) : (
            <Input disabled={loading} />
          )}
        </Item>
        <Item label={t('catalog-category-tree-configuration.language-code')}>
          <Select
            defaultValue={configuration.language_code}
            onChange={handleLanguageCodeChange}
            allowClear
          >
            {languages &&
              languages.map(({ code, name }) => (
                <Option value={code}>{name}</Option>
              ))}
          </Select>
        </Item>
        <Item label={t('catalog-category-tree-configuration.link-pattern')}>
          <Space size="middle" direction="vertical">
            <Input
              value={configuration.link_pattern}
              onChange={handleLinkPatternChange}
            />
            <Alert
              type="info"
              message={t(
                'catalog-category-tree-configuration.link-pattern-info'
              )}
            />
          </Space>
        </Item>
      </Form>
    </Modal>
  )
}
