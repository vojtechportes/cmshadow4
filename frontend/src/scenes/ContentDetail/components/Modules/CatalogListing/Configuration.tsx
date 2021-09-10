import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, TreeSelect, Input, Form, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogListingDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import {
  mapCatalogCategories,
  MappedCatalogCategory,
} from 'mappers/mapCatalogCategories'

const { TextArea } = Input

export type Data = CatalogListingDataProps

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
  const [catalogLanguages, setCatalogLanguages] = useState<CatalogLanguage[]>(
    []
  )
  const [catalogCategories, setCatalogCategories] = useState<
    MappedCatalogCategory[]
  >()

  const getCatalogLanguages = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
      cancelToken,
    })

    setCatalogLanguages(data)
  }, [])

  const getCatalogCategories = useCallback(
    async (cancelToken: CancelToken) => {
      const { data } = await CatalogCategoriesApi.getCatalogCategories(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          cancelToken,
        }
      )

      setCatalogCategories(mapCatalogCategories(data, t))
    },
    [t]
  )

  const handleLanguageChange = useCallback(value => {
    setConfiguration(values => ({
      ...values,
      language_code: value === '' ? null : value,
    }))
  }, [])

  const handleCategoryIdChange = useCallback(value => {
    setConfiguration(values => ({
      ...values,
      category_id: Number(value) === 0 ? null : value,
    }))
  }, [])

  const handleCategoryIdVariableNameChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        category_id_variable_name: value === '' ? null : value,
      }))
    },
    []
  )

  const handleSortChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
      setConfiguration(values => ({
        ...values,
        sort: value === '' ? null : value,
      }))
    },
    []
  )

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getCatalogLanguages(cancelTokenSource.token)
    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogLanguages, getCatalogCategories])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('catalog-listing-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('catalog-listing-configuration.language')}>
          <Select
            onChange={handleLanguageChange}
            defaultValue={data.language_code}
            allowClear
          >
            {catalogLanguages.map(({ code, name }) => (
              <Option key={code} value={code}>
                {name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('catalog-listing-configuration.category-id')}>
          {catalogCategories ? (
            <TreeSelect
              style={{ width: '100%' }}
              onChange={handleCategoryIdChange}
              defaultValue={data.category_id}
              defaultActiveFirstOption
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={catalogCategories}
              placeholder="Please select"
              treeDefaultExpandAll
            />
          ) : (
            <Input disabled />
          )}
        </Item>
        <Item
          label={t('catalog-listing-configuration.category-id-variable-name')}
        >
          <Input
            onChange={handleCategoryIdVariableNameChange}
            defaultValue={data.category_id_variable_name}
          />
        </Item>
        <Item label={t('catalog-listing-configuration.sort')}>
          <TextArea
            onChange={handleSortChange}
            defaultValue={data.sort}
            rows={4}
          />
          <Alert
            type="info"
            message={t('catalog-listing-configuration.sort-note')}
          />
        </Item>
      </Form>
    </Modal>
  )
}
