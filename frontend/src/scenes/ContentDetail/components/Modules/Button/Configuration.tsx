import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { ButtonDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import { ButtonsApi } from 'api/Buttons'
import { Button } from 'model/api/Button'
import { ButtonModuleTargetEnum } from 'model/api/ButtonModuleTargetEnum'

export type Data = ButtonDataProps

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
  const [buttons, setButtons] = useState<Button[]>([])

  const getButtons = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await ButtonsApi.getAllButtons({
      cancelToken,
    })

    setButtons(data)
  }, [])

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()

    setConfiguration(value => ({
      ...value,
      text: event.target.value,
    }))
  }, [])

  const handlePathChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    
    setConfiguration(value => ({
      ...value,
      path: event.target.value,
    }))
  }, [])

  const handleTargetChange = useCallback((target: ButtonModuleTargetEnum) => {
    setConfiguration(value => ({
      ...value,
      target,
    }))
  }, [])

  const handleButtonChange = useCallback((button_id: number) => {
    setConfiguration(value => ({
      ...value,
      button_id,
    }))
  }, [])

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getButtons(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getButtons])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('button-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('button-configuration.text')}>
          <Input
            defaultValue={configuration.text}
            onChange={handleTextChange}
          />
        </Item>        
        <Item label={t('button-configuration.path')}>
          <Input
            defaultValue={configuration.path}
            onChange={handlePathChange}
          />
        </Item>        
        <Item label={t('button-configuration.button-id')}>
          <Select
            defaultValue={configuration.target}
            onChange={handleTargetChange}
          >
            {Object.values(ButtonModuleTargetEnum).map(target => (
              <Option value={target}>{target}</Option>
            ))}
          </Select>
        </Item>
        <Item label={t('button-configuration.button-id')}>
          <Select
            defaultValue={configuration.button_id}
            onChange={handleButtonChange}
          >
            {buttons.map(({ id, name }) => (
              <Option value={id}>{name}</Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  )
}
