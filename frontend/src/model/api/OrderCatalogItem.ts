import { CatalogItemPublic } from './CatalogItemPublic'
import { CatalogCurrency } from './CatalogCurrency'

export interface OrderCatalogItem extends CatalogItemPublic {
  currency: CatalogCurrency
  language: string
}