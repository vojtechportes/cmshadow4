import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface VariableNameActionDetailProps extends RouteComponentProps {
  variableNameActionId?: number
  view: 'new' | 'detail'
}

export const VariableNameActionDetail: React.FC<VariableNameActionDetailProps> = ({
  variableNameActionId,
  view,
}) => {
  const { t } = useTranslation('variable-name-action-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-variable-name-actions')}
            to="/content/variable-name-actions"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return <Form variableNameActionId={variableNameActionId} view={view} />
}
