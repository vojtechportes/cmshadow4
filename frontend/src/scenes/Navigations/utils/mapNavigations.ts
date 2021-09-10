import { Navigation } from 'model/api/Navigation'

export interface MappedNavigation {
  key: string
  id: number
  name: string
  path: string
}

export const mapNavigations = (data: Navigation[]): MappedNavigation[] =>
  data.map(({ id, name, path }) => ({
    key: String(id),
    id,
    name,
    path,
  }))
