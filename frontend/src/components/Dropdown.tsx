import { IconName } from 'constants/icons'
import { Dropdown as DropdownBase, Menu as MenuBase } from 'antd'
import React, { useState } from 'react'
import { rgba } from 'polished'
import { Icon } from 'components/Icon'
import { Dialog, DialogContainer, DialogProps } from 'components/Dialog'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const { Item, Divider } = MenuBase

export const StyledItem = styled(Item)`
  width: 180px;

  svg {
    margin-right: 20px;
  }
`

export const StyledMenu = styled(MenuBase)`
  && {
    border: 1px solid ${COLORS.gray2};
  }
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 28px auto;
  align-items: center;
`

const StyledDialog = styled(Dialog)`
  cursor: initial;
`

const ICON_COLOR = rgba(COLORS.black, 0.51)
const ICON_COLOR_DISABLED = rgba(COLORS.black, 0.25)

export interface DropdownProps {
  children: React.ReactNode | React.ReactNodeArray
  items: DropdownItemProps[]
  trigger?: Array<'click' | 'hover' | 'contextMenu'>
}

export interface DropdownItemProps {
  children: React.ReactNode | React.ReactNodeArray
  icon?: IconName
  onClick?: () => void
  closeOnClick?: boolean
  key?: React.ReactText
  hasDivider?: boolean
  disabled?: boolean
  dialog?: Omit<DialogProps, 'onConfirm' | 'onCancel'>
}

const itemBuilder = (
  {
    children,
    onClick,
    closeOnClick = true,
    icon,
    key,
    disabled = false,
    dialog,
  }: DropdownItemProps,
  index: number,
  handleClick: (onClick: () => void, closeOnClick: boolean) => void,
  handleDialogToggle: () => void,
  isDialogOpen?: boolean
) => {
  const itemContent = icon ? (
    <Wrapper>
      <Icon
        icon={icon}
        size="sm"
        color={disabled ? ICON_COLOR_DISABLED : ICON_COLOR}
      />
      {children}
    </Wrapper>
  ) : (
    children
  )

  return (
    <StyledItem
      onClick={() =>
        onClick &&
        (dialog
          ? !isDialogOpen && handleDialogToggle()
          : handleClick(onClick, closeOnClick))
      }
      key={key ? key : index}
      disabled={disabled}
      data-test="DropdownItem"
    >
      {dialog ? (
        <DialogContainer top="-25px" left={`calc(-100% - 130px)`}>
          {itemContent}
          {isDialogOpen && (
            <StyledDialog
              {...dialog}
              onConfirm={() => onClick && handleClick(onClick, closeOnClick)}
              onCancel={() => handleDialogToggle()}
            />
          )}
        </DialogContainer>
      ) : (
        itemContent
      )}
    </StyledItem>
  )
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  items,
  trigger = ['click'],
}) => {
  const [visible, setVisible] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleVisibleChange = (flag: boolean) => {
    if (visible) {
      setIsDialogOpen(false)
    }

    setVisible(flag)
  }

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const handleClick = (onClick: () => void, closeOnClick: boolean) => {
    if (onClick) {
      onClick()
    }

    if (closeOnClick) {
      setIsDialogOpen(false)
      setVisible(false)
    }
  }

  const overlayItems = []

  for (let item, i = 0; (item = items[i]); i++) {
    if (item.hasDivider) {
      overlayItems.push(<Divider key={'separator-' + i} />)
    }

    overlayItems.push(
      itemBuilder(item, i, handleClick, handleDialogToggle, isDialogOpen)
    )
  }

  const renderOverlay = <StyledMenu>{overlayItems}</StyledMenu>

  return (
    <DropdownBase
      overlay={renderOverlay}
      trigger={trigger}
      onVisibleChange={handleVisibleChange}
      visible={visible}
    >
      {children}
    </DropdownBase>
  )
}
