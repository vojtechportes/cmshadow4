import React from 'react'
import { Button } from 'antd'
import { ButtonProps } from 'antd/es/button'
import { Icon } from 'components/Icon'
import { IconName } from 'constants/icons'
import styled from 'styled-components'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

const StyledIcon = styled(Icon)<{ size: 'sm' | 'xs' }>`
  margin-right: ${({ size }) => size === 'sm' ? '12px' : '7px'};
`

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: IconName
  children: React.ReactNode | React.ReactNodeArray
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  size,
  ...rest
}) => {
  const iconSize: SizeProp = size === 'large' ? 'sm' : 'xs'

  return (
    <Button size={size} {...rest}>
      <>
        <StyledIcon icon={icon} size={iconSize} />
        {children}
      </>
    </Button>
  )
}
