import styled from 'styled-components'

export interface BackdropProps {
  show: boolean
  background?: string
  isScrollable?: boolean
}

export const Backdrop = styled.div<BackdropProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${({ isScrollable }) => (isScrollable ? '100%' : '100vh')};
  min-height: 100vh;
  background: ${({ background }) => background};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  opacity: ${({ show }) => (show ? 0.2 : 0)};
  transition: all 0.2s ease-out;
`

export default Backdrop
