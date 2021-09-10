import styled from 'styled-components'
import { COLORS } from 'constants/colors'

export const Paper = styled.div`
  min-height: calc(100vh - 234px);
  padding: 25px;
  background: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.gray2};
`