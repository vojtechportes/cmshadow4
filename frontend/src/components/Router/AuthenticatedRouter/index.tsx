import React, { useEffect } from 'react'
import { AuthenticatedLayout } from 'components/Layout/AuthenticatedLayout'
import { Router, Redirect } from '@reach/router'
import { Dashboard } from 'scenes/Dashboard'
import { Content } from 'scenes/Content'
import { Catalog } from 'scenes/Catalog'
import { Forms } from 'scenes/Forms'
import { Settings } from 'scenes/Settings'
import { CatalogTemplates } from 'scenes/CatalogTemplates'
import { CatalogTemplateDetail } from 'scenes/CatalogTemplateDetail'
import { CatalogTemplateFieldDetail } from 'scenes/CatalogTemplateFieldDetail'
import { InternalServerError } from 'scenes/InternalServerError'
import { AuthenticatedErrorLayout } from 'components/Layout/AuthenticatedErrorLayout'
import { PageNotFound } from 'scenes/PageNotFound'
import { RedirectTo } from 'scenes/RedirectTo'
import { CatalogLanguages } from 'scenes/CatalogLanguages'
import { CatalogLanguageDetail } from 'scenes/CatalogLanguageDetail'
import { CatalogDetail } from 'scenes/CatalogDetail'
import { CatalogCategories } from 'scenes/CatalogCategories'
import { CatalogCategoryDetail } from 'scenes/CatalogCategoryDetail'
import { ScrollToTop } from 'components/ScrollToTop'
import { CatalogCurrencies } from 'scenes/CatalogCurrencies'
import { CatalogCurrencyDetail } from 'scenes/CatalogCurrencyDetail'
import { CatalogCurrencyTaxRateDetail } from 'scenes/CatalogCurrencyTaxRateDetail'
import { Views } from 'scenes/Views'
import { ViewDetail } from 'scenes/ViewDetail'
import { Templates } from 'scenes/Templates'
import { EmailTemplates } from 'scenes/EmailTemplates'
import { Layouts } from 'scenes/Layouts'
import { LayoutDetail } from 'scenes/LayoutDetail'
import { TemplateDetail } from 'scenes/TemplateDetail'
import { ContentDetail } from 'scenes/ContentDetail'
import { useThunkDispatch } from 'hooks/useThunkDispatch'
import { fetchTemplatePreviews } from 'state/actions/templates'
import { VariableNameActions } from 'scenes/VariableNameActions'
import { VariableNameActionDetail } from 'scenes/VariableNameActionDetail'
import { Navigations } from 'scenes/Navigations'
import { NavigationDetail } from 'scenes/NavigationDetail'
import { NavigationItemDetail } from 'scenes/NavigationItemDetail'
import { NavigationItemsVariableMappings } from 'scenes/NavigationItemVariableMappings'
import { NavigationItemVariableMappingDetail } from 'scenes/NavigationItemVariableMappingDetail'
import { ButtonDetail } from 'scenes/ButtonDetail'
import { Buttons } from 'scenes/Buttons'
import { Orders } from 'scenes/Orders'
import { OrderDetail } from 'scenes/OrderDetail'
import { EmailTemplateDetail } from 'scenes/EmailTemplateDetail'

export const AuthenticatedRouter = () => {
  const { PUBLIC_URL } = process.env
  const dispatch = useThunkDispatch()

  useEffect(() => {
    dispatch(fetchTemplatePreviews())
  }, [dispatch])

  return (
    <Router primary={false}>
      <ScrollToTop path={PUBLIC_URL + '/'}>
        <AuthenticatedLayout path="/">
          <Dashboard path="/" />

          <Content path="/content" />
          <ContentDetail path="/content/new" view="new" key="content-new" />
          <ContentDetail
            path="/content/:identifier"
            view="detail"
            key="content-detail"
          />

          <Views path="/content/views" />
          <ViewDetail path="/content/views/new" view="new" key="view-new" />
          <ViewDetail
            path="/content/views/:viewId"
            view="detail"
            key="view-detail"
          />

          <Layouts path="content/layouts" />
          <LayoutDetail
            path="content/layouts/new"
            view="new"
            key="layout-new"
          />
          <LayoutDetail
            path="content/layouts/:layoutId"
            view="detail"
            key="layout-detail"
          />

          <Templates path="/content/templates" />
          <TemplateDetail
            path="/content/templates/new"
            view="new"
            key="template-new"
          />
          <TemplateDetail
            path="/content/templates/:templateId"
            view="detail"
            key="template-detail"
          />

          <VariableNameActions path="/content/variable-name-actions" />
          <VariableNameActionDetail
            path="/content/variable-name-actions/new"
            view="new"
            key="variable-name-action-new"
          />
          <VariableNameActionDetail
            path="/content/variable-name-actions/:variableNameActionId"
            view="detail"
            key="variable-name-action-detail"
          />

          <Buttons path="/content/modules/buttons" />
          <ButtonDetail
            path="/content/modules/buttons/new"
            view="new"
            key="button-new"
          />
          <ButtonDetail
            path="/content/modules/buttons/:buttonId"
            view="detail"
            key="button-detail"
          />

          <Navigations path="/content/modules/navigations" />
          <NavigationDetail
            path="/content/modules/navigations/new"
            view="new"
            key="navigation-new"
          />
          <NavigationDetail
            path="/content/modules/navigations/:navigationId"
            view="detail"
            key="navigation-detail"
          />

          <NavigationItemDetail
            path="/content/modules/navigations/:navigationId/items/new"
            view="new"
            key="navigation-item-new"
          />
          <NavigationItemDetail
            path="/content/modules/navigations/:navigationId/items/:navigationItemId"
            view="detail"
            key="navigation-item-detail"
          />

          <NavigationItemsVariableMappings path="/content/modules/navigations/:navigationId/items/:navigationItemId/mappings" />
          <NavigationItemVariableMappingDetail
            path="/content/modules/navigations/:navigationId/items/:navigationItemId/mappings/new"
            key="navigation-item-variable-mapping-new"
            view="new"
          />
          <NavigationItemVariableMappingDetail
            path="/content/modules/navigations/:navigationId/items/:navigationItemId/mappings/:navigationItemVariableMappingId"
            key="navigation-item-variable-mapping-detail"
            view="detail"
          />

          <Catalog path="/catalog" />
          <CatalogDetail path="/catalog/new" view="new" key="catalog-new" />
          <CatalogDetail
            path="/catalog/:catalogItemId"
            view="detail"
            key="catalog-detail"
          />

          <CatalogTemplates path="/catalog/templates" />
          <CatalogTemplateDetail
            path="/catalog/templates/new"
            view="new"
            key="catalog-template-new"
          />
          <CatalogTemplateDetail
            path="/catalog/templates/:catalogItemTemplateId"
            view="detail"
            key="catalog-template-detail"
          />

          <CatalogTemplateFieldDetail
            path="/catalog/templates/:catalogItemTemplateId/fields/new"
            view="new"
            key="catalog-template-field-new"
          />
          <CatalogTemplateFieldDetail
            path="/catalog/templates/:catalogItemTemplateId/fields/:catalogItemTemplateFieldId"
            view="detail"
            key="catalog-template-field-detail"
          />

          <CatalogCategories path="/catalog/categories" />
          <CatalogCategoryDetail
            path="/catalog/categories/new"
            view="new"
            key="catlaog-category-new"
          />
          <CatalogCategoryDetail
            path="/catalog/categories/:catalogCategoryId"
            view="detail"
            key="catlaog-category-detail"
          />

          <CatalogLanguages path="/catalog/languages" />
          <CatalogLanguageDetail
            path="/catalog/languages/new"
            view="new"
            key="catalog-language-new"
          />
          <CatalogLanguageDetail
            path="/catalog/languages/:code"
            view="detail"
            key="catalog-language-detail"
          />

          <CatalogCurrencies path="/catalog/currencies" />
          <CatalogCurrencyDetail
            path="/catalog/currencies/new"
            view="new"
            key="catalog-currency-new"
          />
          <CatalogCurrencyDetail
            path="/catalog/currencies/:catalogCurrencyId"
            view="detail"
            key="catalog-currency-detail"
          />

          <CatalogCurrencyTaxRateDetail
            view="new"
            path="/catalog/currencies/:catalogCurrencyId/tax-rates/new"
            key="catalog-currency-tax-rate-new"
          />
          <CatalogCurrencyTaxRateDetail
            view="detail"
            path="/catalog/currencies/:catalogCurrencyId/tax-rates/:catalogCurrencyTaxRateId"
            key="catalog-currency-tax-rate-detail"
          />

          <Orders path="/orders" />

          <EmailTemplates path="/content/email-templates" />
          <EmailTemplateDetail
            key="email-template-new"
            view="new"
            path="/content/email-templates/new"
          />
          <EmailTemplateDetail
            key="email-template-detail"
            view="detail"
            path="/content/email-templates/:emailTemplateId"
          />

          <OrderDetail path="/orders/:orderId" />

          <Forms path="/forms" />

          <Settings path="/settings" />

          <RedirectTo path="/redirect-to" />
          <Redirect
            noThrow
            from="/*"
            to={PUBLIC_URL + '/status/page-not-found'}
          />
        </AuthenticatedLayout>

        <AuthenticatedErrorLayout path={'/status/'}>
          <InternalServerError path="/internal-server-error" />
          <PageNotFound path="/page-not-found" />
        </AuthenticatedErrorLayout>
      </ScrollToTop>
    </Router>
  )
}
