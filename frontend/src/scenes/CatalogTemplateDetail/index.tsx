import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { Fields } from './components/Fields'
import { BackButton } from 'components/BackButton'

export interface CatalogTemplateDetailProps extends RouteComponentProps {
  catalogItemTemplateId?: number
  view: 'new' | 'detail'
}

export const CatalogTemplateDetail: React.FC<CatalogTemplateDetailProps> = ({
  catalogItemTemplateId,
  view,
}) => {
  const { t } = useTranslation('catalog-template-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-templates')}
            to="/catalog/templates"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <>
      <Form catalogItemTemplateId={catalogItemTemplateId} view={view} />
      {view === 'detail' && (
        <Fields catalogItemTempalteId={catalogItemTemplateId} />
      )}
    </>
  )
}
