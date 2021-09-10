import React, { useContext, useCallback } from 'react'
import { NavigationItem } from 'model/api/NavigationItem'
import { NavigationDetailContext } from '..'
import { Skeleton, Tag } from 'antd'
import styled, { css } from 'styled-components'
import { COLORS, PAGE_STATUS_COLORS } from 'constants/colors'
import { Dropdown, DropdownAction } from './Dropdown'
import { PageStatusEnum } from 'model/api/PageStatusEnum'
import { navigate } from '@reach/router'

interface ItemProps {
  depth: number
}

const Item = styled.div<ItemProps>`
  margin-bottom: 6px;
  margin-left: ${({ depth }) => (depth > 0 ? depth * 24 : 0)}px;
  padding: 8px 24px;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

const Grid = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: auto min-content;
  align-items: center;
`

const Name = styled.div`
  white-space: nowrap;
`

const URL = styled.div<{ isPage?: boolean }>`
  display: inline-block;
  padding: 1px 8px 3px;
  font-size: 12px;
  background: ${({ isPage }) => (isPage ? COLORS.white : COLORS.gray1)};
  border: 1px solid ${COLORS.gray2};
  border-radius: 4px;
`

const PublishedURL = styled(URL)`
  background: ${({ isPage }) => (isPage ? COLORS.white : COLORS.green1)};
  border: 1px solid ${COLORS.green2};
`

const StyledDropdown = styled(Dropdown)`
  justify-self: end;
`

const Page = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: max-content max-content max-content max-content;
  width: 100%;
  margin: 12px 0 6px;
  padding: 6px 12px;
  background: ${COLORS.gray1};
  border: 1px solid ${COLORS.gray2};
  border-radius: 3px;
`

const TagGroup = styled.div<{ isPublished: boolean }>`
  ${({ isPublished }) =>
    isPublished &&
    css`
      display: flex;
    `}

  > span.ant-tag:last-child {
    margin-right: 0;
  }
`

export const Tree: React.FC = () => {
  const { PUBLIC_URL } = process.env
  const { navigation, navigationId } = useContext(NavigationDetailContext)

  const handleDropdownClick = useCallback(
    (action: DropdownAction, id: number) => {
      switch (action) {
        case 'edit':
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              id
          )
          break
        case 'edit-mapping':
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/' +
              id +
              '/mappings'
          )
          break
        case 'create':
          navigate(
            PUBLIC_URL +
              '/content/modules/navigations/' +
              navigationId +
              '/items/new?parentId=' +
              id
          )
          break
        case 'delete':
          break
      }
    },
    [PUBLIC_URL, navigationId]
  )

  const renderTree = useCallback(
    (children: NavigationItem[], depth: number) => {
      return children.map(({ id, title, children, path, page }) => (
        <>
          <Item key={id} depth={depth}>
            <Grid>
              <Name>{title}</Name>
              <StyledDropdown
                onClick={action => handleDropdownClick(action, id)}
                disabledActions={!page && ['edit-mapping']}
              />
            </Grid>
            {page ? (
              <>
                <Page>
                  <div>{page.name}</div>
                  <TagGroup isPublished={!!page.is_published}>
                    <Tag color={PAGE_STATUS_COLORS[page.status]}>
                      {page.status}
                    </Tag>
                    {!!page.is_published &&
                      page.status !== PageStatusEnum.PUBLISHED && (
                        <Tag
                          color={PAGE_STATUS_COLORS[PageStatusEnum.PUBLISHED]}
                        >
                          {PageStatusEnum.PUBLISHED}
                        </Tag>
                      )}
                  </TagGroup>
                  {page.status !== PageStatusEnum.PUBLISHED && (
                    <URL isPage>{page.path}</URL>
                  )}
                  {page.published_path && (
                    <PublishedURL isPage>{page.published_path}</PublishedURL>
                  )}
                </Page>
              </>
            ) : (
              path && <URL>{path}</URL>
            )}
          </Item>
          {children && (
            <div key={id + '_children'}>{renderTree(children, depth + 1)}</div>
          )}
        </>
      ))
    },
    [handleDropdownClick]
  )

  if (!navigation) return <Skeleton paragraph={{ rows: 4, width: '100%' }} />

  if (!navigation.items) return null

  return <>{renderTree(navigation.items, 0)}</>
}
