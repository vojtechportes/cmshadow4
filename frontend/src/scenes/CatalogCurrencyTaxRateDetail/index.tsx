import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'

export interface CatalogCurrencyTaxRateDetailProps extends RouteComponentProps {
  catalogCurrencyId?: number
  catalogCurrencyTaxRateId?: number
  view: 'new' | 'detail'
}

export const CatalogCurrencyTaxRateDetail: React.FC<CatalogCurrencyTaxRateDetailProps> = ({
  catalogCurrencyId,
  catalogCurrencyTaxRateId,
  view,
}) => {
  const { t } = useTranslation('catalog-currency-tax-rate-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-catalog-currency-detail')}
            to={'/catalog/currencies/' + catalogCurrencyId}
          />
        }
      />
    )
  }, [setSceneTitle, t, view, catalogCurrencyId])

  return (
    <Form
      catalogCurrencyId={catalogCurrencyId}
      catalogCurrencyTaxRateId={catalogCurrencyTaxRateId}
      view={view}
    />
  )
}
