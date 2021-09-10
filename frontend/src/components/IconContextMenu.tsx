import { ReactComponent as IconContextMenuSvg } from 'assets/images/icon-context-menu.svg'
import { rgba } from 'polished'
import React from 'react'
import { COLORS } from 'constants/colors'

const GRAY = rgba(COLORS.black, 0.65)

interface IconContextMenuProps {
  size?: number
  fill?: string
}

export const IconContextMenu: React.FC<IconContextMenuProps> = ({
  size = 32,
  fill = GRAY,
}) => <IconContextMenuSvg fill={fill} width={size} height={size} />
