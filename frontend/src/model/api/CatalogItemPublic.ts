import { CatalogItemDetail } from './CatalogItemDetail'
import { CatalogItemPublicFieldData } from './CatalogItemPublicFieldData'

export interface CatalogItemPublic
  extends Omit<CatalogItemDetail, 'categories' | 'fields'> {
  data: {
    fields: { [filed_key: string]: CatalogItemPublicFieldData }
    template_name: string
    template_path: string
    view_path: string
  }
}
