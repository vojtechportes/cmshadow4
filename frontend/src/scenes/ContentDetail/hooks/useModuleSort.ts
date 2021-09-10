import { useRef, useContext } from 'react'
import { useDrop, DropTargetMonitor, useDrag } from 'react-dnd'
import { ItemTypes } from '../types/ItemTypes'
import { ContentDetailContext } from '..'
import { findModule } from '../utils/findModule'
import { XYCoord } from 'dnd-core'

export interface Item {
  type: string
  uuid: string
  slotId: number
}

export interface UseModuleSortProps {
  slotId: number
  uuid: string
  locked?: boolean
  onMove: (slotId: number, dragIndex: number, hoverIndex: number) => void
}

export const useModuleSort = ({
  slotId,
  uuid,
  onMove,
  locked,
}: UseModuleSortProps) => {
  const { modules } = useContext(ContentDetailContext)
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.MODULE,
    hover(item: Item, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = findModule(modules, slotId, item.uuid).index
      const hoverIndex = findModule(modules, slotId, uuid).index

      // Don't replace items with themselves
      if (item.uuid === uuid) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      if (slotId === item.slotId) {
        // Time to actually perform the action
        // item.uuid = uuid
        onMove(slotId, dragIndex, hoverIndex)
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.MODULE, uuid, slotId, locked },
    canDrag: () => !locked,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return {
    drag,
    drop,
    isDragging,
    ref,
  }
}
