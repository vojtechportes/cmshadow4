import React, { useCallback } from 'react'
import { Layout } from 'antd'
import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { useLocation, navigate } from '@reach/router'
import styled from 'styled-components'
import { ClickParam } from 'antd/es/menu'

const { Item, SubMenu } = Menu
const { Sider } = Layout

const StyledMenu = styled(Menu)`
  height: 100%;
`

export const Sidebar: React.FC = () => {
  const { PUBLIC_URL } = process.env

  const { t } = useTranslation()
  const { pathname } = useLocation()
  const matchedPath = pathname.replace(PUBLIC_URL, '')

  const handleClick = useCallback(
    ({ key: to }: ClickParam) => {
      navigate(PUBLIC_URL + to)
    },
    [PUBLIC_URL]
  )

  const renderMenu = useCallback(() => {
    if (matchedPath.startsWith('/catalog')) {
      let activeKey

      if (
        matchedPath.startsWith('/catalog') &&
        !matchedPath.includes('/templates') &&
        !matchedPath.includes('/languages') &&
        !matchedPath.includes('/categories') &&
        !matchedPath.includes('/currencies')
      ) {
        activeKey = '/catalog'
      } else if (matchedPath.startsWith('/catalog/templates')) {
        activeKey = '/catalog/templates'
      } else if (matchedPath.startsWith('/catalog/languages')) {
        activeKey = '/catalog/languages'
      } else if (matchedPath.startsWith('/catalog/categories')) {
        activeKey = '/catalog/categories'
      } else if (matchedPath.startsWith('/catalog/currencies')) {
        activeKey = '/catalog/currencies'
      }

      return (
        <StyledMenu mode="inline" defaultSelectedKeys={[activeKey]}>
          <Item onClick={handleClick} key="/catalog">
            {t('sidebar.catalog.items')}
          </Item>
          <Item onClick={handleClick} key="/catalog/templates">
            {t('sidebar.catalog.templates')}
          </Item>
          <Item onClick={handleClick} key="/catalog/languages">
            {t('sidebar.catalog.languages')}
          </Item>
          <Item onClick={handleClick} key="/catalog/categories">
            {t('sidebar.catalog.categories')}
          </Item>
          <Item onClick={handleClick} key="/catalog/currencies">
            {t('sidebar.catalog.currencies')}
          </Item>
        </StyledMenu>
      )
    } else if (matchedPath.startsWith('/content')) {
      let activeKey

      if (
        matchedPath.startsWith('/content') &&
        !matchedPath.includes('/pages') &&
        !matchedPath.includes('/layouts') &&
        !matchedPath.includes('/templates') &&
        !matchedPath.includes('/template-pages') &&
        !matchedPath.includes('/views') &&
        !matchedPath.includes('/variable-name-actions') &&
        !matchedPath.includes('/modules') &&
        !matchedPath.includes('/email-templates')
      ) {
        activeKey = '/content'
      } else if (matchedPath.startsWith('/content/views')) {
        activeKey = '/content/views'
      } else if (matchedPath.startsWith('/content/layouts')) {
        activeKey = '/content/layouts'
      } else if (matchedPath.startsWith('/content/templates')) {
        activeKey = '/content/templates'
      } else if (matchedPath.startsWith('/content/template-pages')) {
        activeKey = '/content/template-pages'
      } else if (matchedPath.startsWith('/content/views')) {
        activeKey = '/content/views'
      } else if (matchedPath.startsWith('/content/variable-name-actions')) {
        activeKey = '/content/variable-name-actions'
      } else if (matchedPath.startsWith('/content/modules')) {
        activeKey = '/content/modules'
      } else if (matchedPath.startsWith('/content/email-templates')) {
          activeKey = '/content/email-templates'
      }

      return (
        <StyledMenu mode="inline" defaultSelectedKeys={[activeKey]}>
          <Item onClick={handleClick} key="/content">
            {t('sidebar.content.pages')}
          </Item>
          <Item onClick={handleClick} key="/content/layouts">
            {t('sidebar.content.layouts')}
          </Item>
          <Item onClick={handleClick} key="/content/templates">
            {t('sidebar.content.templates')}
          </Item>
          <Item onClick={handleClick} key="/content/template-pages" disabled>
            {t('sidebar.content.template-pages')}
          </Item>
          <Item onClick={handleClick} key="/content/views">
            {t('sidebar.content.views')}
          </Item>
          <Item onClick={handleClick} key="/content/variable-name-actions">
            {t('sidebar.content.variable-name-actions')}
          </Item>
          <SubMenu key="/content/modules" title={t('sidebar.content.modules.title')}>
            <Item onClick={handleClick} key="/content/modules/navigations">
              {t('sidebar.content.modules.navigations')}
            </Item>
            <Item onClick={handleClick} key="/content/modules/buttons">
              {t('sidebar.content.modules.buttons')}
            </Item>
          </SubMenu>
          <Item onClick={handleClick} key="/content/email-templates">
            {t('sidebar.content.email-templates')}
          </Item>
        </StyledMenu>
      )
    }
  }, [handleClick, matchedPath, t])

  if (matchedPath === '/') {
    return null
  } else {
    return (
      <Sider theme="light" width={200}>
        {renderMenu()}
      </Sider>
    )
  }
}
