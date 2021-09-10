import { CatalogItem } from 'model/api/CatalogItem'

export interface MappedCatalogItem {
  key: string
  id: number
  field_name_value: string | null
  field_sku_value: string | null
  created_at: Date
  modified_at: Date | null
  published_at: Date | null
  published: boolean
  booked: boolean
}

export const mapCatalogItems = (data: CatalogItem[]): MappedCatalogItem[] =>
  data.map(
    ({
      id,
      field_name_value,
      field_sku_value,
      created_at,
      modified_at,
      published_at,
      published,
      booked,
    }) => ({
      key: String(id),
      id,
      field_name_value: field_name_value ? String(field_name_value) : null,
      field_sku_value: field_sku_value ? String(field_sku_value) : null,
      created_at: new Date(created_at),
      modified_at: modified_at ? new Date(modified_at) : null,
      published_at: published_at ? new Date(published_at) : null,
      published: !!published,
      booked: !!booked
    })
  )
