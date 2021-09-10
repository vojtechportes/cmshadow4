export interface CatalogItem {
  id: number
  template_id: number
  created_at: Date
  modified_at: Date
  created_by: number
  modified_by: number | null
  published: 1 | 0
  published_at: Date
  booked: 1 | 0
  field_name_value?: string
  field_sku_value?: string
  field_description_value?: string
  field_image_value?: string
}
