import { LayoutSlotDetail } from 'model/api/LayoutSlotDetail'

export interface MappedLayoutSlot
  extends Omit<LayoutSlotDetail, 'writeable' | 'locked'> {
  writeable: boolean
  locked: boolean
}

export const mapLayoutSlot = ({
  writeable,
  locked,
  created_at,
  modified_at,
  ...rest
}: LayoutSlotDetail) => ({
  ...rest,
  writeable: !!writeable,
  locked: !!locked,
  created_at: new Date(created_at),
  modified_at: modified_at ? new Date(modified_at) : null,
})
