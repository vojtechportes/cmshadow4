import { CatalogItemTemplate } from 'model/api/CatalogItemTemplate'

export interface MappedCatalogTemplate {
  key: string
  id: number
  view_id: number
  name: string
  path: string
}

export const mapCatalogTemplates = (
  data: CatalogItemTemplate[],
  
): MappedCatalogTemplate[] =>
  data.map(({ id, name, path, view_id }) => ({
    key: String(id),
    id,
    view_id,
    name,
    path
  }))
