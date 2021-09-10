import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface ButtonDetailProps extends RouteComponentProps {
  buttonId?: number
  view: 'new' | 'detail'
}

export const ButtonDetail: React.FC<ButtonDetailProps> = ({
  buttonId,
  view,
}) => {
  const { t } = useTranslation('button-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-buttons')}
            to="/content/modules/buttons"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <Form
      buttonId={buttonId}
      view={view}
    />
  )
}
