import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'

export const Templates: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation('catalog-templates')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(<SceneTitle title={t('scene-title')} />)
  }, [])

  return <>Templates</>
}
