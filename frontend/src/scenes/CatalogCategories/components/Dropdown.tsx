import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type DropdownAction = 'edit' | 'publish' | 'unpublish' | 'create' | 'delete'

export interface DropdownProps {
  onClick: (action: DropdownAction) => void
  disabledActions?: DropdownAction[]
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick, className }) => {
  const { t } = useTranslation('catalog-categories')

  const handleClick = useCallback((action: DropdownAction) => {
    onClick(action)
  }, [onClick])

  const items: DropdownItemProps[] = [
    {
      children: t('tree.context-menu.edit'),
      onClick: () => handleClick('edit'),
      icon: 'pen',
    },   
    {
      children: t('tree.context-menu.create'),
      onClick: () => handleClick('create'),
      icon: 'plus-square',
    }, 
    {
      children: t('tree.context-menu.publish'),
      onClick: () => handleClick('publish'),
      icon: 'cloud-upload-alt',
    },   
    {
      children: t('tree.context-menu.unpublish'),
      onClick: () => handleClick('unpublish'),
      icon: 'cloud-download-alt',
    },       
    {
      children: t('tree.context-menu.delete'),
      onClick: () => handleClick('delete'),
      icon: 'trash-alt',
      dialog: {
        text: t('tree.context-menu.delete-dialog.text'),
        cancel: t('tree.context-menu.delete-dialog.cancel'),
        confirm: t('tree.context-menu.delete-dialog.confirm')
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
