import React, { useCallback } from 'react'
import { IconButton } from './IconButton'
import { navigate } from '@reach/router'

export interface BackButtonProps {
  title: string
  to: string
}

export const BackButton: React.FC<BackButtonProps> = ({ title, to }) => {
  const { PUBLIC_URL } = process.env

  const handleButtonClick = useCallback(() => {
    navigate(PUBLIC_URL + to)
  }, [to, PUBLIC_URL])

  return (
    <IconButton
      icon="arrow-left"
      size="small"
      type="primary"
      shape="round"
      ghost
      onClick={handleButtonClick}
    >
      {title}
    </IconButton>
  )
}
