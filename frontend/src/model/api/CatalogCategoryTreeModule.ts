export interface CatalogCategoryTreeModule {
  parent_id: number
  parent_category_id: number | null
  display_if_parent_category_id: number | null
  language_code: string | null
  link_pattern: string
}