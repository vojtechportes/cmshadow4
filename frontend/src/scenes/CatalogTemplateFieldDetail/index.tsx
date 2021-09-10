import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface CatalogTemplateFieldDetailProps extends RouteComponentProps {
  catalogItemTemplateId?: number
  catalogItemTemplateFieldId?: number
  view: 'new' | 'detail'
}

export const CatalogTemplateFieldDetail: React.FC<CatalogTemplateFieldDetailProps> = ({
  catalogItemTemplateId,
  catalogItemTemplateFieldId,
  view,
}) => {
  const { t } = useTranslation('catalog-template-field-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-template-detail')}
            to={'/catalog/templates/' + catalogItemTemplateId}
          />
        }
      />
    )
  }, [t, catalogItemTemplateId, view, setSceneTitle])

  return (
    <Form
      catalogItemTemplateFieldId={catalogItemTemplateFieldId}
      catalogItemTemplateId={catalogItemTemplateId}
      view={view}
    />
  )
}
