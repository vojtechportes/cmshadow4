import { Layout } from 'model/api/Layout'

export interface MappedLayout {
  key: string
  id: number
  name: string
  created_at: Date
  modified_at: Date | null
}

export const mapLayouts = (data: Layout[]): MappedLayout[] =>
  data.map(({ id, name, created_at, modified_at }) => ({
    key: String(id),
    id,
    name,
    created_at: new Date(created_at),
    modified_at: modified_at ? new Date(modified_at) : null,
  }))
