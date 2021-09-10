import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogDetailDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import { CatalogLanguagesApi } from 'api/CatalogLanguages'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

export type Data = CatalogDetailDataProps

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
  const [, setLoading] = useState(false)

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

  const handleCatalogItemIdChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        catalog_item_id: value === '' ? null : Number(value),
      }))
    },
    []
  )

  const handleLanguageCodeChange = useCallback(
    (language_code: string | null) => {
      setConfiguration(values => ({
        ...values,
        language_code,
      }))
    },
    []
  )

  const handleCatalogItemIdVariableNameChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        catalog_item_id_variable_name: value === '' ? null : value,
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

    return () => cancelTokenSource.cancel()
  }, [getLanguages])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('catalog-detail-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('catalog-detail-configuration.catalog-item-id')}>
          <Input
            allowClear
            type="number"
            value={configuration.catalog_item_id}
            onChange={handleCatalogItemIdChange}
          />
        </Item>
        <Item label={t('catalog-detail-configuration.language-code')}>
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
          label={t(
            'catalog-detail-configuration.catalog-item-id-variable-name'
          )}
        >
          <Input
            onChange={handleCatalogItemIdVariableNameChange}
            defaultValue={data.catalog_item_id_variable_name}
          />
        </Item>
        <Item
          label={t('catalog-detail-configuration.load-from-global-context')}
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
