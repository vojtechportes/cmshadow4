import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface ViewDetailProps extends RouteComponentProps {
  viewId?: number
  view: 'new' | 'detail'
}

export const ViewDetail: React.FC<ViewDetailProps> = ({
  viewId,
  view,
}) => {
  const { t } = useTranslation('view-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-views')}
            to="/content/views"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <Form
      viewId={viewId}
      view={view}
    />
  )
}
