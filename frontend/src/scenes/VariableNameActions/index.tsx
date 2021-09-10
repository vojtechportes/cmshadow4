import React, { useContext, useEffect, useCallback } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Table } from './components/Table'
import { Space, Alert } from 'antd'
import { IconButton } from 'components/IconButton'

export const VariableNameActions: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('variable-name-actions')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreateVariable = useCallback(() => {
    navigate(PUBLIC_URL + '/content/variable-name-actions/new')
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
        onClick={handleCreateVariable}
      >
        {t('create-new-variable-action')}
      </IconButton>
      <Alert type="info" message={t('variable-name-actions-info')} />
      <Table />
    </Space>
  )
}
