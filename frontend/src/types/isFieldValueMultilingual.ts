import { CatalogItemFieldData } from 'model/api/CatalogItemDetailFieldData'

export const isFieldValueMultilingual = (
  value: { [key: string]: CatalogItemFieldData } | CatalogItemFieldData
): value is { [key: string]: CatalogItemFieldData } => {
  return !Object.keys(value).includes('extra_content')
}
