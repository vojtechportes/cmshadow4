import React, { useContext, useEffect, useCallback } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Table } from './components/Table'
import { Space } from 'antd'
import { IconButton } from 'components/IconButton'
import { DetailInfo } from './components/DetailInfo'
import { BackButton } from 'components/BackButton'

export interface NavigationItemsVariableMappingsProps
  extends RouteComponentProps {
  navigationId?: number
  navigationItemId?: number
}

export const NavigationItemsVariableMappings: React.FC<NavigationItemsVariableMappingsProps> = ({
  navigationId,
  navigationItemId,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-item-variable-mappings')

  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreateMapping = useCallback(() => {
    navigate(
      PUBLIC_URL +
        '/content/modules/navigations/' +
        navigationId +
        '/items/' +
        navigationItemId +
        '/mappings/new'
    )
  }, [PUBLIC_URL, navigationId, navigationItemId])

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t('scene-title.title')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-navigation-detail')}
            to={`/content/modules/navigations/${navigationId}`}
          />
        }
      />
    )
  }, [setSceneTitle, t, navigationId])

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <IconButton
        size="middle"
        type="primary"
        icon="plus"
        onClick={handleCreateMapping}
      >
        {t('create-new-variable-mapping')}
      </IconButton>
      <DetailInfo
        navigationId={navigationId}
        navigationItemId={navigationItemId}
      />
      <Table navigationId={navigationId} navigationItemId={navigationItemId} />
    </Space>
  )
}
