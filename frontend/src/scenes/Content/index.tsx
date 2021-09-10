import React, { useContext, useEffect, useCallback } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Space } from 'antd'
import { IconButton } from 'components/IconButton'
import { Table } from './components/Table'

export const Content: React.FC<RouteComponentProps> = ({ location }) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('content')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreatePage = useCallback(() => {
    navigate(PUBLIC_URL + '/content/new')
  }, [PUBLIC_URL])

  useEffect(() => {
    setSceneTitle(<SceneTitle title={t('scene-title')} />)
  }, [setSceneTitle, t])

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <IconButton
        size="middle"
        type="primary"
        icon="plus"
        onClick={handleCreatePage}
      >
        {t('create-new-page')}
      </IconButton>
      <Table location={location} />
    </Space>
  )
}
