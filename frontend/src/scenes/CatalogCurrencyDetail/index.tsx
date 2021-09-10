import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { TaxRates } from './components/TaxRates'

export interface CatalogCurrencyDetailProps extends RouteComponentProps {
  catalogCurrencyId?: number
  view: 'new' | 'detail'
}

export const CatalogCurrencyDetail: React.FC<CatalogCurrencyDetailProps> = ({
  catalogCurrencyId,
  view,
}) => {
  const { t } = useTranslation('catalog-currency-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-currencies')}
            to="/catalog/currencies"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <>
      <Form catalogCurrencyId={catalogCurrencyId} view={view} />
      {view === 'detail' && <TaxRates catalogCurrencyId={catalogCurrencyId} />}
    </>
  )
}
