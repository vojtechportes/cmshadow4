import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

export const StyledErrorMessage = styled.div`
  margin: 6px 0 12px;
  color: ${COLORS.red1};
`

interface CustomErrorMessageProps {
  error: {
    message: string,
    params: any[]
  }
}

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({ error }) => {
  const { t } = useTranslation('form-validation')

  return (
    <StyledErrorMessage>
      {t(error.message, error.params)}
    </StyledErrorMessage>
  )
}

export default CustomErrorMessage
