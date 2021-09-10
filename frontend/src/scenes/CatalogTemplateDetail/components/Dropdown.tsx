import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type DropdownAction = 'edit' | 'delete'

export interface DropdownProps {
  onClick: (action: DropdownAction) => void
  disabledActions?: DropdownAction[]
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick }) => {
  const { t } = useTranslation('catalog-template-detail')

  const handleClick = (action: DropdownAction) => {
    onClick(action)
  }

  const items: DropdownItemProps[] = [
    {
      children: t('fields.table.context-menu.edit'),
      onClick: () => handleClick('edit'),
      icon: 'pen',
    },
    {
      children: t('fields.table.context-menu.delete'),
      onClick: () => handleClick('delete'),
      icon: 'trash-alt',
      dialog: {
        text: t('fields.table.context-menu.delete-dialog.text'),
        cancel: t('fields.table.context-menu.delete-dialog.cancel'),
        confirm: t('fields.table.context-menu.delete-dialog.confirm'),
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
