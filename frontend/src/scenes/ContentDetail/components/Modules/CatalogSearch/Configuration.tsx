import React, { useCallback, useState } from 'react'
import { Modal, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { CatalogSearchDataProps } from 'scenes/ContentDetail/types/Module'
export type Data = CatalogSearchDataProps

export interface ConfigurationProps {
  data: Data
  onConfirm: (data: Data) => void
  onCancel: () => void
}

const { Item } = Form

export const Configuration: React.FC<ConfigurationProps> = ({
  data,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('content-detail')
  const [configuration, setConfiguration] = useState(data)

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleSearchPlaceholderChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        search_placeholder: value,
      }))
    },
    []
  )

  const handleSubmitLabelChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setConfiguration(values => ({
        ...values,
        submit_label: value,
      }))
    },
    []
  )

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('catalog-search-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('catalog-search-configuration.search-placeholder')}>
          <Input
            defaultValue={configuration.search_placeholder}
            onChange={handleSearchPlaceholderChange}
          />
        </Item>
        <Item label={t('catalog-search-configuration.submit-label')}>
          <Input
            defaultValue={configuration.submit_label}
            onChange={handleSubmitLabelChange}
          />
        </Item>
      </Form>
    </Modal>
  )
}
