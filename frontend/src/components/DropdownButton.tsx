import { Button } from 'antd'
import { IconContextMenu } from 'components/IconContextMenu'
import styled from 'styled-components'
import React from 'react'
import { COLORS } from 'constants/colors'

export const StyledButton = styled(Button)<{ size: 'small' | 'large' }>`
  && {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    width: ${({ size }) => (size === 'small' ? '25px' : '38px')};
    height: ${({ size }) => (size === 'small' ? '25px' : '38px')};
    padding: 0;

    :hover,
    :focus,
    :active {
      svg {
        transition: fill 0.3s;
        fill: ${COLORS.blue1};
      }
    }
  }
`
export interface DropdownButtonProps {
  onClick?: () => void
  size?: 'small' | 'large'
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  onClick,
  size = 'large',
}) => (
  <StyledButton onClick={onClick} size={size}>
    <IconContextMenu size={size === 'small' ? 14 : 18} />
  </StyledButton>
)
