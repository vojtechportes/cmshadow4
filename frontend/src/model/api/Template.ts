export interface Template {
  id: number
  layout_id: number
  view_id: number
  name: string
  html_head_end: string
  html_body_start: string
  html_body_end: string
  created_at: Date
  created_by: number
  modified_at: Date
  modified_by: number
}