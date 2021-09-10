import React from 'react'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-left: 24px;
  background: ${COLORS.gray2};
`

const Title = styled.div`
  white-space: nowrap;
`

export interface HeaderProps {
  children: React.ReactNode | React.ReactNodeArray
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => (
  <StyledHeader className={className}>
    <Title>{children}</Title>
    <Line />
  </StyledHeader>
)
