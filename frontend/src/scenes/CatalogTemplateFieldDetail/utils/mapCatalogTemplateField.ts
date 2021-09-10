import { CatalogItemTemplateField } from 'model/api/CatalogItemTemplateField'

export interface MappedCatalogTemplateField
  extends Omit<
    CatalogItemTemplateField,
    'is_searchable' | 'is_sortable' | 'use_in_listing' | 'is_multilingual'
  > {
  is_multilingual: boolean
  use_in_listing: boolean
  is_sortable: boolean
  is_searchable: boolean
}

export const mapCatalogTemplateField = ({
  default_value,
  id,
  is_multilingual,
  is_searchable,
  is_sortable,
  name,
  key,
  template_group_id,
  template_id,
  type,
  use_in_listing,
  weight,
}: CatalogItemTemplateField): MappedCatalogTemplateField => ({
  is_multilingual: !!is_multilingual,
  use_in_listing: !!use_in_listing,
  is_sortable: !!is_sortable,
  is_searchable: !!is_searchable,
  default_value,
  id,
  name,
  key,
  template_group_id,
  template_id,
  type,
  weight,
})
