import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogItemDataProps } from 'scenes/ContentDetail/types/Module'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import axios, { CancelToken } from 'axios'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

export type Data = CatalogItemDataProps

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

  const getCatalogLanguages = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await CatalogLanguagesApi.getAllCatalogLanguages({
      cancelToken,
    })

    setCatalogLanguages(data)
  }, [])


  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleCatalogItemIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()

    setConfiguration(value => ({
      ...value,
      catalog_item_id: Number(event.target.value),
    }))
  }, [])

  const handleLanguageChange = useCallback(value => {
    setConfiguration(values => ({
      ...values,
      language_code: value === '' ? null : value,
    }))
  }, [])
  
  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getCatalogLanguages(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogLanguages])


  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('catalog-item-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('catalog-item-configuration.catalog-item-id')}>
          <Input
            type="number"
            defaultValue={configuration.catalog_item_id}
            onChange={handleCatalogItemIdChange}
          />
        </Item>        
        <Item label={t('catalog-item-configuration.language-code')}>
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
      </Form>
    </Modal>
  )
}
