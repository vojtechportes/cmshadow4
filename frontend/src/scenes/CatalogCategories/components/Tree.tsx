import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import { CatalogCategory } from 'model/api/CatalogCategory'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Tag, Skeleton, notification } from 'antd'
import { Dropdown, DropdownAction } from './Dropdown'
import { navigate } from '@reach/router'

interface ItemProps {
  depth: number
}

const Item = styled.div<ItemProps>`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: min-content min-content auto;
  margin-bottom: 6px;
  margin-left: ${({ depth }) => depth > 0 && depth * 24}px;
  padding: 8px 24px;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

const Name = styled.div`
  white-space: nowrap;
`

const StyledDropdown = styled(Dropdown)`
  justify-self: end;
`

export const Tree: React.FC = () => {
  const { t } = useTranslation('catalog-categories')
  const [data, setData] = useState<CatalogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const { PUBLIC_URL } = process.env

  const getData = useCallback(async (cancelToken: CancelToken) => {
    try {
      setLoading(true)

      const response = await CatalogCategoriesApi.getCatalogCategories(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          cancelToken,
        }
      )

      setData(response.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [])

  const handleDropdownClick = useCallback(
    async (action: DropdownAction, id: number) => {
      const cancelToken = cancelTokenRef.current.token

      switch (action) {
        case 'create':
          navigate(PUBLIC_URL + '/catalog/categories/new?parentId=' + id)
          break
        case 'edit':
          navigate(PUBLIC_URL + '/catalog/categories/' + id)
          break
        case 'delete':
          try {
            await CatalogCategoriesApi.deleteCatalogCategory(id, {
              cancelToken,
            })

            getData(cancelToken)

            notification.success({ message: t('delete-success') })
          } catch (e) {}
          break
        case 'publish':
          try {
            await CatalogCategoriesApi.publishCatalogCategory(id, {
              cancelToken,
            })

            getData(cancelToken)

            notification.success({ message: t('publish-success') })
          } catch (e) {}
          break
        case 'unpublish':
          try {
            await CatalogCategoriesApi.unpublishCatalogCategory(id, {
              cancelToken,
            })

            getData(cancelToken)

            notification.success({ message: t('unpublish-success') })
          } catch (e) {}
          break
        default:
          break
      }
    },
    [PUBLIC_URL, t, getData]
  )

  const renderTree = useCallback(
    (children: CatalogCategory[], depth: number) => {
      return children.map(({ id, name, published, items_count, children }) => (
        <>
          <Item key={id} depth={depth}>
            <Name>
              {name} {t('tree.items-count', { itemsCount: items_count })}
            </Name>
            {published ? (
              <Tag color={COLORS.green2}>{t('tree.published')}</Tag>
            ) : (
              <div />
            )}
            <StyledDropdown
              onClick={action => handleDropdownClick(action, id)}
            />
          </Item>
          {children && (
            <div key={id + '_children'}>{renderTree(children, depth + 1)}</div>
          )}
        </>
      ))
    },
    [t, handleDropdownClick]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData])

  useEffect(() => {
    const cancelTokenSource = cancelTokenRef.current

    return () => cancelTokenSource.cancel()
  }, [])

  if (loading) {
    return <Skeleton active loading paragraph={{ rows: 4, width: '400px' }} />
  }

  return <>{renderTree(data, 0)}</>
}
