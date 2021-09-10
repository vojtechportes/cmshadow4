import { CatalogCetgoryDetailData } from './CatalogCategoryDetailData'

export interface CatalogCategory {
  id: number
  name: string
  parent_id: number | null
  weight: number
  published: 0 | 1
  items_count?: number
  data?: { [key: string]: CatalogCetgoryDetailData } | CatalogCetgoryDetailData
  children?: CatalogCategory[]
}
