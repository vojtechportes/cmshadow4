import React, { useCallback, useContext } from 'react'
import { Typography, Divider, Space, Alert } from 'antd'
import styled from 'styled-components'
import { IconButton } from 'components/IconButton'
import { useTranslation } from 'react-i18next'
import { navigate } from '@reach/router'
import { NavigationDetailContext } from '..'
import { Tree } from './Tree'

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const { Title } = Typography

export const Items: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-detail')
  const { navigationId } = useContext(NavigationDetailContext)

  const handleCreateItem = useCallback(() => {
    navigate(
      PUBLIC_URL + '/content/modules/navigations/' + navigationId + '/items/new'
    )
  }, [PUBLIC_URL, navigationId])

  return (
    <>
      <Divider />
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <TitleContainer>
          <Title level={3}>{t('items.title')}</Title>
          <IconButton
            size="middle"
            type="primary"
            icon="plus"
            onClick={handleCreateItem}
          >
            {t('items.create-new-item')}
          </IconButton>
        </TitleContainer>
        <Alert message={t('items-info')} type="info" />
        <Alert message={t('items-warning')} type="warning" />
        <Tree />
      </Space>
    </>
  )
}
