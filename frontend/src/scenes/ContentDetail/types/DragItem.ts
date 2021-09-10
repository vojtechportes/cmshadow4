import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'

export interface DragItem {
  uuid?: string
  slotId?: number
  type: string
  moduleType: ModuleTypeEnum
  locked?: boolean
}
