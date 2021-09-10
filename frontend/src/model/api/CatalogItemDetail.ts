import { CatalogItem } from './CatalogItem'
import { CatalogItemDetailField } from './CatalogItemDetailField'

export interface CatalogItemDetail
  extends Omit<
    CatalogItem,
    | 'field_name_value'
    | 'field_description_value'
    | 'field_image_value'
    | 'field_sku_value'
  > {
  fields: CatalogItemDetailField[]
  categories: number[]
}
