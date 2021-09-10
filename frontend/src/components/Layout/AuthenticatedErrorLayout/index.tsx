import React from 'react'
import { Layout } from 'antd'
import { Navigation } from 'components/Navigation'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { RouteComponentProps } from '@reach/router'
import { Logo } from 'components/Logo'
import { StyledHeader } from '../AuthenticatedLayout'

const { Footer } = Layout

const Main = styled(Layout)`
  min-height: calc(100vh - 134px);
  padding: 50px 0;
  background: ${COLORS.white};
`

export interface AuthenticatedLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray
}

export const AuthenticatedErrorLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <Layout>
      <StyledHeader>
        <Logo />
        <Navigation />
      </StyledHeader>
      <Main>{children}</Main>
      <Footer>Footer</Footer>
    </Layout>
  )
}
