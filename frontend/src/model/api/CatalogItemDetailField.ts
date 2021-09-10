import { CatalogItemTemplateField } from './CatalogItemTemplateField'
import { CatalogItemFieldData } from './CatalogItemDetailFieldData'

export interface CatalogItemDetailField extends CatalogItemTemplateField {
  data:
    | {
        [key: string]: CatalogItemFieldData
      }
    | CatalogItemFieldData
}
