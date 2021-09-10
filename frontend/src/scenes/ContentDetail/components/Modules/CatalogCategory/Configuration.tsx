import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form, TreeSelect, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogCategoryDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

export type Data = CatalogCategoryDataProps

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

  const handleCategoryChange = useCallback(
    (category_id: number) => {
      setConfiguration(value => ({
        ...value,
        category_id,
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

  const handleCategoryIdVariableNameChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        category_id_variable_name: value === '' ? null : value,
      }))
    },
    []
  )

  const handleLoadFromGlobalContextChange = useCallback((checked: boolean) => {
    setConfiguration(values => ({
      ...values,
      load_from_global_context: checked,
    }))
  }, [])

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
      title={t('catalog-category-configuration.title')}
    >
      <Form layout="vertical">
        <Item
          label={t('catalog-category-configuration.category-id')}
        >
          {categories ? (
            <TreeSelect
              style={{ width: '100%' }}
              defaultActiveFirstOption
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              defaultValue={configuration.category_id}
              treeData={categories}
              onChange={handleCategoryChange}
              placeholder="Please select"
              treeDefaultExpandAll
            />
          ) : (
            <Input disabled={loading} />
          )}
        </Item>
        <Item label={t('catalog-category-configuration.language-code')}>
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
        <Item
          label={t('catalog-category-configuration.category-id-variable-name')}
        >
          <Input
            onChange={handleCategoryIdVariableNameChange}
            defaultValue={data.category_id_variable_name}
          />
        </Item>
        <Item
          label={t('catalog-category-configuration.load-from-global-context')}
        >
          <Switch
            onChange={handleLoadFromGlobalContextChange}
            checked={configuration.load_from_global_context}
            defaultChecked={data.load_from_global_context}
          />
        </Item>
      </Form>
    </Modal>
  )
}
