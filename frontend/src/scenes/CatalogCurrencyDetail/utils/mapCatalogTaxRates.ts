import { CatalogCurrencyTaxRate } from 'model/api/CatalogCurrencyTaxRate'

export interface MappedCatalogTaxRate {
  key: string
  id: number
  rate: number
}

export const mapCatalogTaxRates = (
  data: CatalogCurrencyTaxRate[]
): MappedCatalogTaxRate[] =>
  data.map(({ id, rate }) => ({
    key: String(id),
    id,
    rate,
  }))
