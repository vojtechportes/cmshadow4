import { Page } from 'model/api/Page'
import { PageStatusEnum } from 'model/api/PageStatusEnum'

export interface MappedPage {
  key: string
  identifier: string
  parent: string
  name: string | React.ReactElement
  path: string
  created_at: Date
  created_by: number | null
  modified_at: Date | null
  modified_by: number | null
  status: PageStatusEnum
  version: number
  has_children: boolean
  is_published: boolean
}

export const mapPages = (data: Page[]): MappedPage[] =>
  data.map(
    ({
      identifier,
      parent,
      name,
      path,
      created_at,
      created_by,
      modified_at,
      modified_by,
      status,
      version,
      has_children,
      is_published,
    }) => ({
      key: String(identifier),
      identifier,
      parent,
      name,
      path,
      created_at: new Date(created_at),
      created_by,
      modified_at: modified_at ? new Date(modified_at) : null,
      modified_by,
      status,
      version,
      has_children: !!has_children,
      is_published: !!is_published,
    })
  )
