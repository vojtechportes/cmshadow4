import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { parse } from 'query-string'

export interface CatalogCategoryDetailProps extends RouteComponentProps {
  catalogCategoryId?: number
  view: 'new' | 'detail'
}

export const CatalogCategoryDetail: React.FC<CatalogCategoryDetailProps> = ({
  catalogCategoryId,
  view,
  location,
}) => {
  const { t } = useTranslation('catalog-category-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const { parentId } = parse(location.search)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-categories')}
            to="/catalog/categories"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <Form
      parentId={parentId ? Number(parentId) : undefined}
      catalogCategoryId={catalogCategoryId}
      view={view}
    />
  )
}
