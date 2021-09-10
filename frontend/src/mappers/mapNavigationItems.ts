import { Page } from 'model/api/Page'
import mapObject from 'map-obj'
import { NavigationItem } from 'model/api/NavigationItem'

export interface MappedNavigationItem
  extends Omit<Page, 'id' | 'title' | 'children'> {
  value: string | null
  title: string
  disabled?: boolean
  children?: MappedNavigationItem[]
}

export const mapNavigationItems = (
  data: NavigationItem[],
) => {
  const mappedNavigationItems = (mapObject(
    data,
    (key: any, value: any) => {
      switch (key) {
        case 'id':
          return ['value', value]
        case 'children':
        default:
          return [key, value]
      }
    },
    { deep: true }
  ) as unknown) as MappedNavigationItem[]

  return mappedNavigationItems
}
