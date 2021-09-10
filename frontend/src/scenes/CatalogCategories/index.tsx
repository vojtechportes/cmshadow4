import React, { useContext, useEffect, useCallback } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Space } from 'antd'
import { IconButton } from 'components/IconButton'
import { Tree } from './components/Tree'

export const CatalogCategories: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('catalog-categories')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreateCatalogCategory = useCallback(() => {
    navigate(PUBLIC_URL + '/catalog/categories/new')
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
        onClick={handleCreateCatalogCategory}
      >
        {t('create-new-catalog-category')}
      </IconButton>
      <Tree />
    </Space>
  )
}
