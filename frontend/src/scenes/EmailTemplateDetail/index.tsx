import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface EmailTemplateDetailProps extends RouteComponentProps {
  emailTemplateId?: number
  view: 'new' | 'detail'
}

export const EmailTemplateDetail: React.FC<EmailTemplateDetailProps> = ({
  emailTemplateId,
  view,
}) => {
  const { t } = useTranslation('email-template-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-email-templates')}
            to="/content/email-templates"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <Form
      emailTemplateId={emailTemplateId}
      view={view}
    />
  )
}
