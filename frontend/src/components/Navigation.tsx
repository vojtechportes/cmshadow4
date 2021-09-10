import React, { useCallback } from 'react'
import { Menu, Button } from 'antd'
import { ClickParam } from 'antd/es/menu'
import { useTranslation } from 'react-i18next'
import { navigate, useLocation } from '@reach/router'
import { logout } from 'state/actions/session'
import { useThunkDispatch } from 'hooks/useThunkDispatch'
import styled from 'styled-components'

const { Item } = Menu

const LogoutButton = styled(Button)`
  margin-left: 24px;
`

export const Navigation: React.FC = () => {
  const { t } = useTranslation()
  const { PUBLIC_URL } = process.env
  const { pathname } = useLocation()
  const matchedPath = pathname.replace(PUBLIC_URL, '')
  const dispatch = useThunkDispatch()

  const getSelectedKeys = useCallback(() => {
    let activeKey

    if (matchedPath === '/') {
      activeKey = '/'
    } else if (matchedPath.startsWith('/pages')) {
      activeKey = '/pages'
    } else if (matchedPath.startsWith('/catalog')) {
      activeKey = '/catalog'
    } else if (matchedPath.startsWith('/forms')) {
      activeKey = '/forms'
    } else if (matchedPath.startsWith('/orders')) {
      activeKey = '/orders'
    } else if (matchedPath.startsWith('/settings')) {
      activeKey = '/settings'
    }

    return [activeKey]
  }, [matchedPath])

  const handleClick = useCallback(
    ({ key: to }: ClickParam) => {
      navigate(PUBLIC_URL + to)
    },
    [PUBLIC_URL]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={getSelectedKeys()}>
      <Item onClick={handleClick} key="/">
        {t('navigation.dashboard')}
      </Item>
      <Item onClick={handleClick} key="/content">
        {t('navigation.content')}
      </Item>
      <Item onClick={handleClick} key="/catalog">
        {t('navigation.catalog')}
      </Item>
      <Item onClick={handleClick} key="/orders">
        {t('navigation.orders')}
      </Item>
      <Item onClick={handleClick} key="/forms">
        {t('navigation.forms')}
      </Item>
      <Item onClick={handleClick} key="/settings">
        {t('navigation.settings')}
      </Item>
      <LogoutButton
        onClick={handleLogout}
        type="primary"
        shape="round"
        // ghost
        size="small"
      >
        {t('navigation.logout')}
      </LogoutButton>
    </Menu>
  )
}
