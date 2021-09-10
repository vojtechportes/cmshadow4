import { CatalogLanguage } from 'model/api/CatalogLanguage'

export interface MappedCatalogLanguage {
  key: string
  name: string
  code: string
}

export const mapCatalogLanguages = (
  data: CatalogLanguage[]
): MappedCatalogLanguage[] =>
  data.map(({ name, code }) => ({
    key: String(code),
    name,
    code,
  }))
