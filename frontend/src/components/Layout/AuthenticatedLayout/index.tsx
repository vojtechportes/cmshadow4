import React, { createContext, useState } from 'react'
import { Layout } from 'antd'
import { Paper } from 'components/Paper'
import { Navigation } from 'components/Navigation'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { RouteComponentProps } from '@reach/router'
import { Logo } from 'components/Logo'
import { Sidebar } from 'components/Sidebar'
import { SidePanelDragProvider } from 'components/SidepanelDragProvider'

const { Content, Header, Footer } = Layout

export const Main = styled(Layout)`
  && {
    margin: 0 50px 50px;
    background: ${COLORS.white};
  }
`

export const Container = styled.div`
  margin: 25px 50px;
`

export const StyledLayout = styled(Layout)`
  && {
    background: ${COLORS.gray1};
  }
`

export const StyledHeader = styled(Header)`
  && {
    display: grid;
    grid-template-columns: min-content min-content;
  }
`

export interface AuthenticatedLayoutContextProps {
  sceneTitle: React.ReactNode | React.ReactNodeArray
  setSceneTitle: React.Dispatch<React.SetStateAction<React.ReactNode>>
  hasSidebar: boolean
  setHasSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthenticatedLayoutContext = createContext(
  {} as AuthenticatedLayoutContextProps
)

export interface AuthenticatedLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const [sceneTitle, setSceneTitle] = useState<
    React.ReactNode | React.ReactNodeArray
  >(null)
  const [hasSidebar, setHasSidebar] = useState(true)

  return (
    <SidePanelDragProvider>
      <AuthenticatedLayoutContext.Provider
        value={{ sceneTitle, setSceneTitle, hasSidebar, setHasSidebar }}
      >
        <StyledLayout>
          <StyledHeader>
            <Logo />
            <Navigation />
          </StyledHeader>
          <Container>{sceneTitle}</Container>
          <Main>
            {hasSidebar && <Sidebar />}
            <Content>
              <Paper>{children}</Paper>
            </Content>
          </Main>
          <Footer>
            &copy; Shadow Systems 2019 - {new Date().getFullYear()}
          </Footer>
        </StyledLayout>
      </AuthenticatedLayoutContext.Provider>
    </SidePanelDragProvider>
  )
}
