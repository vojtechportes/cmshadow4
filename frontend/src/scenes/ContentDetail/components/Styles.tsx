import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Controls } from './Modules/styles'

export const Styles = styled.div<{ styles: string }>`
  width: 100%;

  * {
    a,
    button,
    input,
    select,
    textarea {
      pointer-events: none;
    }

    ${Controls} {
      pointer-events: initial;

      * {
        pointer-events: initial;
      }
    }
  }

  *::after:not(.mce-content-body) {
    display: table;
    clear: both;
    content: '';
  }

  .cms__slot {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 64px;
    padding: 6px;
    padding-top: 34px !important;
    background: ${COLORS.white};
    border: 1px solid ${COLORS.purple1} !important;

    &--active {
      box-shadow: 0px 0px 11px 0 ${COLORS.purple1};
    }
  }

  ${({ styles }) => styles}
`
