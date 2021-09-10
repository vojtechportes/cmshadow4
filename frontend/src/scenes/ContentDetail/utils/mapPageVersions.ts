import { Page } from 'model/api/Page'
import { PageStatusEnum } from 'model/api/PageStatusEnum'

export interface MappedPageVersion {
  key: string
  identifier: string
  modified_at: Date | null
  modified_by: number | null
  status: PageStatusEnum
  version: number
}

export const mapPageVersions = (data: Page[]): MappedPageVersion[] =>
  data.map(
    ({
      identifier,
      modified_at,
      modified_by,
      status,
      version,
    }) => ({
      key: String(identifier),
      identifier,
      modified_at: modified_at ? new Date(modified_at) : null,
      modified_by,
      status,
      version,
    })
  )
