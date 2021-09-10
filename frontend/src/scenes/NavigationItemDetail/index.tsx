import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { parse } from 'query-string'

export interface NavigationItemDetailProps extends RouteComponentProps {
  navigationItemId?: number
  navigationId?: number
  view: 'new' | 'detail'
}

export const NavigationItemDetail: React.FC<NavigationItemDetailProps> = ({
  navigationId,
  navigationItemId,
  view,
  location,
}) => {
  const { t } = useTranslation('navigation-item-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const { parentId } = parse(location.search)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-navigation-detail')}
            to={`/content/modules/navigations/${navigationId}`}
          />
        }
      />
    )
  }, [setSceneTitle, t, view, navigationId])

  return (
    <Form
      parentId={parentId ? Number(parentId) : undefined}
      navigationId={navigationId}
      navigationItemId={navigationItemId}
      view={view}
    />
  )
}
