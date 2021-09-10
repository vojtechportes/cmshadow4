import { CatalogCategory } from './CatalogCategory'
import { CatalogCetgoryDetailData } from './CatalogCategoryDetailData'

export interface CatalogCategoryDetail
  extends Omit<CatalogCategory, 'children'> {
  data: {
    [key: string]: CatalogCetgoryDetailData
  }
}
