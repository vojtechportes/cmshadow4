import { ModuleTypeEnum } from './ModuleTypeEnum'
import { PageTypeEnum } from './PageTypeEnum'

export interface Module {
  id: number
  identifier: string | null
  page_identifier: string | null
  page_version: number | null
  template_page_id: number | null
  layout_id: number
  slot_id: number
  weight: number
  page_type: PageTypeEnum
  module_type: ModuleTypeEnum | null
}
