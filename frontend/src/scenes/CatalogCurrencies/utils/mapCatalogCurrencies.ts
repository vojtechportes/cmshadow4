import { CatalogCurrency } from 'model/api/CatalogCurrency'

export interface MappedCatalogCurrency {
  key: string
  id: number
  name: string
  code: string
  symbol: string
  is_main: boolean
  rate: number
}

export const mapCatalogCurrencies = (
  data: CatalogCurrency[]
): MappedCatalogCurrency[] =>
  data.map(({ id, name, code, symbol, is_main, rate }) => ({
    key: String(id),
    id,
    name,
    code,
    symbol,
    is_main: !!is_main,
    rate,
  }))
