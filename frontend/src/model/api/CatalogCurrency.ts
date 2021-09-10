export interface CatalogCurrency {
  id: number
  name: string
  code: string
  symbol: string
  rate: number
  decimal_places: number
  is_main: 0 | 1
  inherits_tax_rate: 0 | 1
  fetch_currency_rate: 0 | 1
}
