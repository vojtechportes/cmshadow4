import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { COLORS } from 'constants/colors'

const { Content } = Layout

const StyledContent = styled(Content)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${COLORS.blue5};
`

export interface AnonymousLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray
}

export const AnonymousLayout: React.FC<AnonymousLayoutProps> = ({
  children,
}) => (
  <Layout>
    <StyledContent>{children}</StyledContent>
  </Layout>
)
