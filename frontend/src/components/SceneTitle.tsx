import React from 'react'
import { Typography, Space } from 'antd'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

const { Title } = Typography

const StyledTitle = styled(Title)`
  && {
    margin: 0;
    font-size: 28px;
  }
`

const ExtraContentContainer = styled.div`
  margin-top: 2px;
`

export interface SceneTitleProps {
  title: string
  extraContent?: React.ReactNode | React.ReactNodeArray
}

export const SceneTitle: React.FC<SceneTitleProps> = ({
  title,
  extraContent,
}) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Space direction="horizontal" size="middle">
      <StyledTitle level={1} style={{ fontSize: 28 }}>
        {title}
      </StyledTitle>
      {extraContent && (
        <ExtraContentContainer>{extraContent}</ExtraContentContainer>
      )}
    </Space>
  </>
)
