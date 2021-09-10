import { CatalogItemTemplateFieldTypeEnum } from './CatalogItemTemplateFieldTypeEnum'

export interface CatalogItemTemplateField {
  id: number
  template_id: number
  template_group_id: number | null
  is_multilingual: 1 | 0
  name: string
  key: string
  type: CatalogItemTemplateFieldTypeEnum
  default_value: string
  use_in_listing: 1 | 0
  is_sortable: 1 | 0
  is_searchable: 1 | 0
  weight: number
}
