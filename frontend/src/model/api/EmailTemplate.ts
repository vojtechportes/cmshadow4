import { EmailTemplateTypeEnum } from './EmailTemplateTypeEnum'

export interface EmailTemplate {
  id: number
  type: EmailTemplateTypeEnum
  content: string
  language: string
  created_at: Date
  modified_at: Date | null
}
