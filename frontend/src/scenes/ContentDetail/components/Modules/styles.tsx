import styled, { css } from 'styled-components'
import { COLORS } from 'constants/colors'
import { rgba } from 'polished'

export const Controls = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  z-index: 200;
  display: none;
  min-width: 100%;
  padding: 6px;
  background: ${COLORS.white};
  border: 1px solid ${COLORS.gray2};
`

export const Container = styled.div<{ locked: boolean }>`
  position: relative;
  min-width: 64px;
  min-height: 24px;
  margin: 12px;

  ${({ locked }) => !locked ? css`
    border: 2px dotted ${rgba(COLORS.cyan2, 0.5)};
  ` : css`
    opacity: 0.8;
  `}

  cursor: ${({ locked }) => (locked ? 'not-allowed' : 'move')};

  :hover {
    ${Controls} {
      display: grid;
      grid-gap: 24px;
      grid-template-columns: max-content max-content;
    }
  }
`
