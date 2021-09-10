import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface CatalogLanguageDetailProps extends RouteComponentProps {
  code?: string
  view: 'new' | 'detail'
}

export const CatalogLanguageDetail: React.FC<CatalogLanguageDetailProps> = ({
  code,
  view,
}) => {
  const { t } = useTranslation('catalog-language-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-languages')}
            to="/catalog/languages"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return <Form code={code} view={view} />
}
