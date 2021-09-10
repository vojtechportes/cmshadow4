import { EmailTemplate } from 'model/api/EmailTemplate'
import { EmailTemplateTypeEnum } from 'model/api/EmailTemplateTypeEnum'

export interface MappedEmailTemplate {
  key: string
  id: number
  type: EmailTemplateTypeEnum
  language: string
  created_at: Date
  modified_at: Date | null
}

export const mapEmailTemplates = (
  data: EmailTemplate[]
): MappedEmailTemplate[] =>
  data.map(({ id, type, language, created_at, modified_at }) => ({
    key: String(id),
    id,
    type,
    language,
    created_at: new Date(created_at),
    modified_at: modified_at ? new Date(modified_at) : null,
  }))
