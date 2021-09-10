import styled from 'styled-components'
import { COLORS } from 'constants/colors'

export const FieldGroup = styled.div`
  margin: 24px 0;
  padding: 24px 24px 12px;
  border: 1px solid ${COLORS.gray2};
  border-radius: 3px;

  form {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: 12px;

    > .ant-row {
      margin: 0;
    }
  }
`

export const MultiLingual = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
`