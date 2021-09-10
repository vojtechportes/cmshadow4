import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type DropdownAction = 'edit' | 'edit-mapping' | 'create' | 'delete'

export interface DropdownProps {
  onClick: (action: DropdownAction) => void
  disabledActions?: DropdownAction[]
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick, className, disabledActions }) => {
  const { t } = useTranslation('navigation-detail')

  const handleClick = useCallback((action: DropdownAction) => {
    onClick(action)
  }, [onClick])

  const items: DropdownItemProps[] = [
    {
      children: t('items.tree.context-menu.edit'),
      onClick: () => handleClick('edit'),
      icon: 'pen',
    },   
    {
      children: t('items.tree.context-menu.edit-mapping'),
      onClick: () => handleClick('edit-mapping'),
      icon: 'map-signs',
      disabled: disabledActions && disabledActions.includes('edit-mapping')
    },   
    {
      children: t('items.tree.context-menu.create'),
      onClick: () => handleClick('create'),
      icon: 'plus-square',
    }, 
    {
      children: t('items.tree.context-menu.delete'),
      onClick: () => handleClick('delete'),
      icon: 'trash-alt',
      dialog: {
        text: t('items.tree.context-menu.delete-dialog.text'),
        cancel: t('items.tree.context-menu.delete-dialog.cancel'),
        confirm: t('items.tree.context-menu.delete-dialog.confirm')
      }
    },
  ]

  return (
    <div className={className}>
      <DropdownBase items={items} data-test="Dropdown">
        <DropdownButton size="small" />
      </DropdownBase>
    </div>
  )
}
