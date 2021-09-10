import React, { useCallback } from 'react'
import { useDrop, XYCoord } from 'react-dnd'
import { useThunkDispatch } from 'hooks/useThunkDispatch'
import { setContentSidePanelPosition } from 'state/actions/user'

export const SidePanelTypes = {
  SIDE_PANEL: 'side_panel',
}

export interface ContainerProps {
  children: React.ReactNode | React.ReactNodeArray
}

export interface SidePanelProps {
  type: string
  top: number
  left: number
}

export const SidePanelDragProvider: React.FC<ContainerProps> = ({
  children,
}) => {
  const dispatch = useThunkDispatch()

  const [, drop] = useDrop({
    accept: SidePanelTypes.SIDE_PANEL,
    drop(item: SidePanelProps, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      moveSidePanel(left, top)
      return undefined
    },
  })

  const moveSidePanel = useCallback(
    (left: number, top: number) => {
      dispatch(setContentSidePanelPosition({ top, left }))
    },
    [dispatch]
  )

  return <div ref={drop}>{children}</div>
}
