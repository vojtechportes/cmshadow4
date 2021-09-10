import React, { useContext, useEffect, useCallback } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Table } from './components/Table'
import { Space } from 'antd'
import { IconButton } from 'components/IconButton'

export const Buttons: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('buttons')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreateButton = useCallback(() => {
    navigate(PUBLIC_URL + '/content/modules/buttons/new')
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
        onClick={handleCreateButton}
      >
        {t('create-new-button')}
      </IconButton>
      <Table />
    </Space>
  )
}
