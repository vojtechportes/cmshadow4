import { CatalogItemTemplateField } from 'model/api/CatalogItemTemplateField'
import { CatalogItemTemplateFieldTypeEnum } from 'model/api/CatalogItemTemplateFieldTypeEnum'

export interface MappedCatalogTemplateField {
  key: string
  id: number
  template_id: number
  template_group_id: number
  is_multilingual: boolean
  name: string
  field_key: string
  type: CatalogItemTemplateFieldTypeEnum
  default_value: string
  is_searchable: boolean
  is_sortable: boolean
  use_in_listing: boolean
  weight: number
}

export const mapCatalogTemplateFields = (
  data: CatalogItemTemplateField[]
): MappedCatalogTemplateField[] =>
  data.map(
    ({
      id,
      name,
      key: field_key,
      default_value,
      is_multilingual,
      is_searchable,
      is_sortable,
      template_group_id,
      template_id,
      type,
      use_in_listing,
      weight,
    }) => ({
      key: String(id),
      id,
      template_id,
      template_group_id,
      is_multilingual: !!is_multilingual,
      name,
      field_key,
      type,
      default_value,
      is_searchable: !!is_searchable,
      is_sortable: !!is_sortable,
      use_in_listing: !!use_in_listing,
      weight,
    })
  )
