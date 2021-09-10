import { CatalogCategory } from 'model/api/CatalogCategory'
import mapObject from 'map-obj'
import i18next from 'i18next'

export interface MappedCatalogCategory
  extends Omit<CatalogCategory, 'id' | 'name' | 'children'> {
  value: number | null
  title: string
  children?: MappedCatalogCategory[]
}

export const mapCatalogCategories = (
  data: CatalogCategory[],
  t: i18next.TFunction,
  noCategoryOption: boolean = true
) => {
  const mappedCategorires = (mapObject(
    data,
    (key: any, value: any) => {
      switch (key) {
        case 'id':
          return ['value', value]
        case 'name':
          return ['title', value]
        case 'children':
        default:
          return [key, value]
      }
    },
    { deep: true }
  ) as unknown) as MappedCatalogCategory[]

  if (noCategoryOption) {
    mappedCategorires.unshift({
      value: 0,
      title: t('none'),
      parent_id: 0,
      published: 0,
      weight: 0,
    })
  }

  return mappedCategorires
}
