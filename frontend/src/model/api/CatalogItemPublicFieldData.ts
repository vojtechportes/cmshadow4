import { CatalogItemTemplateFieldTypeEnum } from './CatalogItemTemplateFieldTypeEnum'

export interface CatalogItemPublicFieldData {
  key: string | null
  name: string
  value: any
  default_value: any
  type: CatalogItemTemplateFieldTypeEnum
  is_multilingual: 0 | 1
  language: string | null
}
