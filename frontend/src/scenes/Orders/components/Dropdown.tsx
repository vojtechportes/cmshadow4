import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from 'antd'
import styled from 'styled-components'

const GridItem = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: min-content auto;
` 

export type DropdownAction =
  | 'view'
  | 'accept'
  | 'reject'
  | 'close'
  | 'reopen'
  | 'delete'

export interface DropdownProps {
  status: OrderStatusEnum
  onClick: (action: DropdownAction, silent: boolean) => void
  disabledActions?: DropdownAction[]
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick, status }) => {
  const { t } = useTranslation('orders')
  const [silent, setSilent] = useState(false)

  const handleClick = useCallback(
    (action: DropdownAction) => {
      onClick(action, silent)
    },
    [onClick, silent]
  )

  const items: DropdownItemProps[] = [
    {
      children: (
        <GridItem>
          <Switch onChange={checked => setSilent(checked)}/>
          {t('table.context-menu.silent')}
        </GridItem>
      )
    },
    {
      children: t('table.context-menu.view'),
      onClick: () => handleClick('view'),
      icon: 'eye',
      hasDivider: true,
    },
    {
      children: t('table.context-menu.accept'),
      onClick: () => handleClick('accept'),
      icon: 'check',
      disabled: status !== OrderStatusEnum.NEW,
    },
    {
      children: t('table.context-menu.reject'),
      onClick: () => handleClick('reject'),
      icon: 'times-circle',
      disabled: status !== OrderStatusEnum.NEW,
    },
    {
      children: t('table.context-menu.close'),
      onClick: () => handleClick('close'),
      icon: 'check-double',
      disabled:
        status === OrderStatusEnum.CLOSED || status === OrderStatusEnum.NEW,
    },
    {
      children: t('table.context-menu.reopen'),
      onClick: () => handleClick('reopen'),
      icon: 'redo-alt',
      disabled:
        status === OrderStatusEnum.NEW ||
        status === OrderStatusEnum.REJECTED ||
        status === OrderStatusEnum.ACCEPTED,
    },
    {
      children: t('table.context-menu.delete'),
      onClick: () => handleClick('delete'),
      icon: 'trash-alt',
      dialog: {
        text: t('table.context-menu.delete-dialog.text'),
        cancel: t('table.context-menu.delete-dialog.cancel'),
        confirm: t('table.context-menu.delete-dialog.confirm'),
      },
    },
  ]

  return (
    <div>
      <DropdownBase items={items} data-test="Dropdown">
        <DropdownButton size="small" />
      </DropdownBase>
    </div>
  )
}
