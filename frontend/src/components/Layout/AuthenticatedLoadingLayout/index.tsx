import React from 'react'
import { Layout, Skeleton } from 'antd'
import { Paper } from 'components/Paper'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import {
  StyledHeader as Header,
  StyledLayout,
  Main,
  Container,
} from '../AuthenticatedLayout'

const { Content, Footer } = Layout

const StyledHeader = styled(Header)`
  && {
    background-color: ${COLORS.gray3};
  }
`

const StyledSkeleton = styled(Skeleton)`
  && {
    background: ${COLORS.gray1};
  }
`

export const AuthenticatedLoadingLayout: React.FC = () => (
  <StyledLayout>
    <StyledHeader />
    <Container>
      <StyledSkeleton active title={{ width: 250 }} paragraph={false} />
    </Container>
    <Main>
      <Content>
        <Paper>
          <Skeleton active paragraph={{ rows: 4, width: 550 }} />
        </Paper>
      </Content>
    </Main>
    <Footer />
  </StyledLayout>
)
