export interface LayoutSlot {
  id: number
  parent_id: number | null
  layout_id: number
  name: string
  writeable: 0 | 1
  locked: 0 | 1
  weight: number
  html_class_name: string
  html_id: string
  created_at: Date
  created_by: number | null
  modified_at: Date | null
  modified_by: number | null
  children?: LayoutSlot[]
}