import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedPage } from './mapPages'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { Icon } from 'components/Icon'
import { COLORS, PAGE_STATUS_COLORS } from 'constants/colors'
import styled, { css } from 'styled-components'
import { Link } from '@reach/router'
import { format } from 'date-fns'
import { DATE_TIME_FORMAT } from 'constants/date'
import { Tag } from 'antd'
import { PageStatusEnum } from 'model/api/PageStatusEnum'

const Name = styled.div`
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 24px max-content;
  align-items: center;
`

const TagGroup = styled.div<{ isPublished: boolean }>`
  ${({ isPublished }) => isPublished && css`
    display: flex;
  `}
`

const { PUBLIC_URL } = process.env

export const getPagesColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, identifier: string) => void
): ColumnProps<any>[] => [
  {
    key: 'name',
    dataIndex: 'name',
    fixed: 'left',
    title: t('table.columns.name'),
    width: 250,
    render: (value: string, { has_children, identifier }: MappedPage) => {
      const name = (
        <Name>
          <Icon
            icon={has_children ? 'folder' : 'file'}
            color={has_children ? COLORS.orange2 : COLORS.blue1}
          />
          {value}
        </Name>
      )

      if (has_children) {
        return (
          <Link to={PUBLIC_URL + '/content?parent=' + identifier}>{name}</Link>
        )
      } else {
        return name
      }
    },
  },
  {
    key: 'path',
    dataIndex: 'path',
    title: t('table.columns.path'),
    width: 250,
    render: (value: string) => (
      <a href={value} target="_blank">
        {value}
      </a>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: t('table.columns.status'),
    width: 140,
    render: (value: PageStatusEnum, { is_published }: MappedPage) => {
      const isPublished = is_published && value !== PageStatusEnum.PUBLISHED

      return (
        <TagGroup isPublished={isPublished}>
          <Tag color={PAGE_STATUS_COLORS[value]}>{value}</Tag>
          {isPublished && (
            <Tag color={PAGE_STATUS_COLORS[PageStatusEnum.PUBLISHED]}>
              {PageStatusEnum.PUBLISHED}
            </Tag>
          )}
        </TagGroup>
      )
    },
  },
  {
    key: 'version',
    dataIndex: 'version',
    title: t('table.columns.version'),
    width: 110,
  },
  {
    key: 'created_at',
    dataIndex: 'created_at',
    title: t('table.columns.created-at'),
    render: (value: Date) => format(value, DATE_TIME_FORMAT),
    width: 180,
  },
  {
    key: 'modified_at',
    dataIndex: 'modified_at',
    title: t('table.columns.modified-at'),
    render: (value: Date | null) =>
      value ? format(value, DATE_TIME_FORMAT) : '-',
    width: 180,
  },
  {
    key: 'context_menu',
    dataIndex: 'context_menu',
    fixed: 'right',
    width: 60,
    render: (_, { identifier }: MappedPage) => (
      <Dropdown
        onClick={(action: DropdownAction) =>
          onClick && onClick(action, identifier)
        }
      />
    ),
  },
]
