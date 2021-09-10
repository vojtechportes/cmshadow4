import React from 'react'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const Title = styled.div`
  padding: 2px 8px 3px;
  color: ${COLORS.white};
  font-size: 12px;
  background: ${COLORS.purple2};
`

export interface SlotControlsProps {
  name: string
}

export const SlotControls: React.FC<SlotControlsProps> = ({ name }) => {
  return (
    <Container>
      <Title>{name}</Title>
    </Container>
  )
}
