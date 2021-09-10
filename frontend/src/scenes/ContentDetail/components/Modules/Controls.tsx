import React from 'react'
import { Controls as ControlsContainer } from './styles'
import { Button } from 'antd'
import styled from 'styled-components'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { useTranslation } from 'react-i18next'

const { Group } = Button

const StyledGroup = styled(Group)`
  white-space: nowrap;
`

export interface ControlsProps {
  moduleType: ModuleTypeEnum
  hasEdit?: boolean
  hasConfiguration?: boolean
  onEdit?: () => void
  onConfigure?: () => void
  onDelete?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Controls: React.FC<ControlsProps> = ({
  moduleType,
  hasEdit = true,
  hasConfiguration = true,
  onEdit,
  onConfigure,
  onDelete,
  className,
  style,
}) => {
  const { t } = useTranslation('content-detail')

  return (
    <ControlsContainer className={className} style={style}>
      {t(`module-type-enum.${moduleType.toLowerCase()}`)}
      <StyledGroup>
        {hasEdit && (
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
        )}
        {hasConfiguration && (
          <Button size="small" onClick={onConfigure}>
            Configuration
          </Button>
        )}
        <Button size="small" type="danger" onClick={onDelete}>
          Delete
        </Button>
      </StyledGroup>
    </ControlsContainer>
  )
}
