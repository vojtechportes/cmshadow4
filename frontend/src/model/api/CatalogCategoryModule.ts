export interface CatalogCategoryModule {
  parent_id: number
  category_id: number
  language_code: string | null
  category_id_variable_name: string | null
  load_from_global_context: 0 | 1
}