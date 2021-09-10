import { View } from 'model/api/View'

export interface MappedView {
  key: string
  id: number
  name: string
  path: string
}

export const mapViews = (data: View[]): MappedView[] =>
  data.map(({ id, name, path }) => ({
    key: String(id),
    id,
    name,
    path,
  }))
