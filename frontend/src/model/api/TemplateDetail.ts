import { Template } from './Template'
import { TemplatePage } from './TemplatePage'

export interface TemplateDetail extends Template {
  template_pages: TemplatePage[]
}
