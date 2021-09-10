import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface NavigationItemVariableMappingDetailProps
  extends RouteComponentProps {
  navigationId?: number
  navigationItemId?: number
  navigationItemVariableMappingId?: number
  view: 'new' | 'detail'
}

export const NavigationItemVariableMappingDetail: React.FC<NavigationItemVariableMappingDetailProps> = ({
  navigationId,
  navigationItemId,
  navigationItemVariableMappingId,
  view,
}) => {
  const { t } = useTranslation('navigation-item-variable-item-mapping-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-navigation-item-variable-mappings')}
            to={
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              navigationItemId +
              '/mappings'
            }
          />
        }
      />
    )
  }, [setSceneTitle, t, view, navigationId, navigationItemId])

  return (
    <Form
      navigationId={navigationId}
      navigationItemId={navigationItemId}
      navigationItemVariableMappingId={navigationItemVariableMappingId}
      view={view}
    />
  )
}
