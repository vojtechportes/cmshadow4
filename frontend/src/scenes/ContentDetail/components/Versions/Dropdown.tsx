import {
  Dropdown as DropdownBase,
  DropdownItemProps,
} from 'components/Dropdown'
import { DropdownButton } from 'components/DropdownButton'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type DropdownAction = 'revert' | 'preview'

export interface DropdownProps {
  onClick: (action: DropdownAction) => void
  disabledActions?: DropdownAction[]
}

export const Dropdown: React.FC<DropdownProps> = ({ onClick }) => {
  const { t } = useTranslation('content-detail')

  const handleClick = (action: DropdownAction) => {
    onClick(action)
  }

  const items: DropdownItemProps[] = [
    {
      children: t('versions.table.context-menu.preview'),
      onClick: () => handleClick('preview'),
      icon: 'eye',
    },
    {
      children: t('versions.table.context-menu.revert'),
      onClick: () => handleClick('revert'),
      icon: 'arrow-left',
      dialog: {
        text: t('versions.table.context-menu.delete-dialog.text'),
        cancel: t('versions.table.context-menu.delete-dialog.cancel'),
        confirm: t('versions.table.context-menu.delete-dialog.confirm'),
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
