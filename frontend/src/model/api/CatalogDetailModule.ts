export interface CatalogDetailModule {
  parent_id: number
  catalog_item_id: number
  language_code: string | null
  catalog_item_id_variable_name: string | null
  load_from_global_context: 0 | 1
}