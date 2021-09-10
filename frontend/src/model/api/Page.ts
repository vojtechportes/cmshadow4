import { PageStatusEnum } from './PageStatusEnum'
import { PageMetaRobotsEnum } from './PageMetaRobotsEnum';

export interface Page {
  id: number
  identifier: string
  parent: string
  name: string
  template_id: number
  path: string
  created_at: Date
  created_by: number | null
  modified_at: Date | null
  modified_by: number | null
  status: PageStatusEnum
  version: number
  meta_title: string
  meta_description: string
  meta_keywords?: string
  meta_robots?: PageMetaRobotsEnum
  meta_canonical?: string | null
  meta_image: string | null
  html_head_end?: string
  html_body_start?: string
  html_body_end?: string
  has_children?: 0 | 1
  is_published?: 0 | 1
  children?: Page[]
}
