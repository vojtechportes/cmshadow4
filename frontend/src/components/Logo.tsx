import React from 'react'
import styled from 'styled-components'
import logo from 'assets/images/logo.png'

const StyledLogo = styled.div`
  width: 130px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
`

export const Logo: React.FC = () => <StyledLogo />
