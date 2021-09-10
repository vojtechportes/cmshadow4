import { IconName } from 'constants/icons'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import React from 'react'

export interface IconProps
  extends Pick<
    FontAwesomeIconProps,
    'color' | 'size' | 'className' | 'transform'
  > {
  icon: IconName
}

export const Icon: React.FC<IconProps> = ({
  icon,
  color,
  size,
  className,
  transform,
}) => (
  <FontAwesomeIcon
    icon={icon}
    color={color}
    size={size}
    transform={transform}
    className={className}
  />
)
