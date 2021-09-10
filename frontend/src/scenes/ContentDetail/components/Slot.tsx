import React, { useMemo } from 'react'
import { LayoutSlot } from 'model/api/LayoutSlot'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { SlotControls } from './SlotControls'
import { SlotModules } from './SlotModules'
import { rgba } from 'polished'
import { Icon } from 'components/Icon'
import { useModuleMove } from '../hooks/useModuleMove'

/* const StyledSlot = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  min-height: 64px;
  padding: 6px;
  border: 1px solid ${COLORS.purple1};

  ${({ isActive }) =>
    isActive &&
    css`
      box-shadow: 0px 0px 11px 0 rgba(115, 209, 61, 1);
    `};
` */

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${rgba(COLORS.gray3, 0.5)};
  user-select: none;
`

export interface SlotProps {
  data: LayoutSlot
}

export const Slot: React.FC<SlotProps> = ({
  data: { name, html_class_name, html_id, children, locked, id: slotId },
}) => {
  const { drop, isActive } = useModuleMove({ slotId, locked })

  return useMemo(
    () => (
      <div
        ref={drop}
        className={
          html_class_name +
          ' cms__slot' +
          (isActive ? ' cms__slot--active' : '')
        }
        id={html_id}
      >
        {!locked ? (
          <SlotControls name={name} />
        ) : (
          <LockedOverlay>
            <Icon icon="lock" size="lg" />
          </LockedOverlay>
        )}
        <SlotModules slotId={slotId} />
        {children && children.map(data => <Slot data={data} key={data.id} />)}
      </div>
    ),
    [drop, isActive, html_class_name, html_id, children, slotId, name, locked]
  )
}
