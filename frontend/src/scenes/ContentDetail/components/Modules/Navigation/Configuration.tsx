import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Select, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavigationDataProps } from 'scenes/ContentDetail/types/Module'
import axios, { CancelToken } from 'axios'
import { NavigationsApi } from 'api/Navigations'
import { Navigation } from 'model/api/Navigation'

export type Data = NavigationDataProps

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
  const [navigations, setNavigations] = useState<Navigation[]>([])

  const getNavigations = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await NavigationsApi.getAllNavigations({
      cancelToken,
    })

    setNavigations(data)
  }, [])

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleNavigationChange = useCallback((navigation_id: number) => {
    setConfiguration(value => ({
      ...value,
      navigation_id,
    }))
  }, [])

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getNavigations(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getNavigations])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('navigation-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('navigation-configuration.navigation')}>
          <Select
            defaultValue={configuration.navigation_id}
            onChange={handleNavigationChange}
          >
            {navigations.map(({ id, name }) => (
              <Option value={id}>{name}</Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  )
}
