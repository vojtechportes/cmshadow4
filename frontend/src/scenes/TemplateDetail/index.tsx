import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface TemplatDetailProps extends RouteComponentProps {
  templateId?: number
  view: 'new' | 'detail'
}

export const TemplateDetail: React.FC<TemplatDetailProps> = ({
  templateId,
  view,
}) => {
  const { t } = useTranslation('template-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-templates')}
            to="/content/templates"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <Form
      templateId={templateId}
      view={view}
    />
  )
}
