import React from 'react'
import { Icon } from 'components/Icon'
import { IconName } from 'constants/icons'
import { COLORS } from 'constants/colors'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../types/ItemTypes'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  background-color: ${COLORS.gray1};
  cursor: move;

  &:hover {
    color: ${COLORS.white};
    background-color: ${COLORS.blue1};
  }
`

const Label = styled.div`
  margin-top: 2px;
  font-size: 12px;
`

export interface SidePanelItemProps {
  moduleType: ModuleTypeEnum
  icon: IconName
  label: string
}

export const SidePanelItem: React.FC<SidePanelItemProps> = ({
  moduleType,
  icon,
  label,
}) => {
  const [{ opacity }, drag] = useDrag({
    item: { type: ItemTypes.NEW_MODULE, moduleType },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  })

  return (
    <Container ref={drag} style={{ opacity }}>
      <Icon icon={icon} />
      <Label>{label}</Label>
    </Container>
  )
}
