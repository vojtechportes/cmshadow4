import React, { useCallback, useState } from 'react'
import { Modal, Select, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { HeadingDataProps } from 'scenes/ContentDetail/types/Module'
import { HeadingModuleLevelEnum } from 'model/api/HeadingModuleLevelEnum'
import { iterableEnum } from 'utils/iterableEnum'

export type Data = Omit<HeadingDataProps, 'content'>

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

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleLevelChange = useCallback((level: number) => {
    setConfiguration(value => ({
      ...value,
      level,
    }))
  }, [])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('heading-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('heading-configuration.level')}>
          <Select
            defaultValue={configuration.level}
            onChange={handleLevelChange}
          >
            {Object.values(iterableEnum(HeadingModuleLevelEnum)).map(level => (
              <Option value={level} kex={level}>
                {level}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  )
}
