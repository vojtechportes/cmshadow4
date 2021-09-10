import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Table } from './components/Table'
import { Space } from 'antd'

export const Orders: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation('orders')
  const { setSceneTitle, setHasSidebar } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(<SceneTitle title={t('scene-title')} />)
  }, [setSceneTitle, t])

  useEffect(() => {
    setHasSidebar(false)

    return () => setHasSidebar(true)
  }, [setHasSidebar])

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <Table />
    </Space>
  )
}
