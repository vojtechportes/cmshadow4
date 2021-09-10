import { CatalogCurrency } from 'model/api/CatalogCurrency'

export interface MappedCatalogCurrency
  extends Omit<
    CatalogCurrency,
    'is_main' | 'inherits_tax_rate' | 'fetch_currency_rate'
  > {
  is_main: boolean
  inherits_tax_rate: boolean
  fetch_currency_rate: boolean
}

export const mapCatalogCurrency = ({
  id,
  name,
  code,
  symbol,
  rate,
  decimal_places,
  is_main,
  inherits_tax_rate,
  fetch_currency_rate,
}: CatalogCurrency): MappedCatalogCurrency => ({
  id,
  name,
  code,
  symbol,
  rate,
  decimal_places,
  is_main: !!is_main,
  inherits_tax_rate: !!inherits_tax_rate,
  fetch_currency_rate: !!fetch_currency_rate,
})
