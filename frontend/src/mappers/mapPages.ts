import { Page } from 'model/api/Page'
import mapObject from 'map-obj'

export interface MappedPage
  extends Omit<Page, 'identifier' | 'name' | 'children'> {
  value: string | null
  title: string
  children?: MappedPage[]
}

export const mapPages = (
  data: Page[],
) => {
  const mappedPages = (mapObject(
    data,
    (key: any, value: any) => {
      switch (key) {
        case 'identifier':
          return ['value', value]
        case 'name':
          return ['title', value]
        case 'children':
        default:
          return [key, value]
      }
    },
    { deep: true }
  ) as unknown) as MappedPage[]

  return mappedPages
}
