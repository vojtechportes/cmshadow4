import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import React from 'react'
import { useTranslation } from 'react-i18next'


export type DropdownAction = 'edit' | 'publish' | 'unpublish' | 'delete' | 'book' | 'unbook'

export interface DropdownProps {
  onClick: (action: DropdownAction) => void
  disabledActions?: DropdownAction[]
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick, disabledActions = [] }) => {
  const { t } = useTranslation('catalog')

  const handleClick = (action: DropdownAction) => {
    onClick(action)
  }

  const items: DropdownItemProps[] = [
    {
      children: t('table.context-menu.edit'),
      onClick: () => handleClick('edit'),
      icon: 'pen',
    },
    {
      children: t('table.context-menu.publish'),
      onClick: () => handleClick('publish'),
      icon: 'cloud-upload-alt',
      disabled: disabledActions.includes('publish')
    },    
    {
      children: t('table.context-menu.unpublish'),
      onClick: () => handleClick('unpublish'),
      icon: 'cloud-download-alt',
      disabled: disabledActions.includes('unpublish')
    },    
    {
      children: t('table.context-menu.book'),
      onClick: () => handleClick('book'),
      icon: 'lock',
      disabled: disabledActions.includes('book')
    },    
    {
      children: t('table.context-menu.unbook'),
      onClick: () => handleClick('unbook'),
      icon: 'unlock',
      disabled: disabledActions.includes('unbook')
    },      
    {
      children: t('table.context-menu.delete'),
      onClick: () => handleClick('delete'),
      icon: 'trash-alt',
      dialog: {
        text: t('table.context-menu.delete-dialog.text'),
        cancel: t('table.context-menu.delete-dialog.cancel'),
        confirm: t('table.context-menu.delete-dialog.confirm')
      }
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
