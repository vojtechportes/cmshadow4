import { Template } from 'model/api/Template'

export interface MappedTemplate {
  key: string
  id: number
  name: string
  created_at: Date
  modified_at: Date
}

export const mapTemplates = (data: Template[]): MappedTemplate[] =>
  data.map(({ id, name, created_at, modified_at }) => ({
    key: String(id),
    id,
    name,
    created_at: created_at ? new Date(created_at) : null,
    modified_at: modified_at ? new Date(modified_at) : null,
  }))
