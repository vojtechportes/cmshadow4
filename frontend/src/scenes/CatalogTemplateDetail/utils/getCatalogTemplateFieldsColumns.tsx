import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { MappedCatalogTemplateField } from './mapCatalogTemplateFields'
import i18next from 'i18next'
import { DropdownAction, Dropdown } from '../components/Dropdown'
import { CatalogItemTemplateFieldTypeEnum } from 'model/api/CatalogItemTemplateFieldTypeEnum'
import { CATALOG_FIELD_TYPE_COLORS } from 'constants/colors'
import { Tag } from 'antd'

export const getCatalogTemplateFieldsColumns = (
  t: i18next.TFunction,
  onClick?: (action: DropdownAction, id: number) => void
): ColumnProps<any>[] => [
  {
    key: 'id',
    dataIndex: 'id',
    title: t('fields.table.columns.id'),
    width: 90,
    fixed: 'left',
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: t('fields.table.columns.type'),
    width: 100,
    render: (value: CatalogItemTemplateFieldTypeEnum) => (
      <Tag color={CATALOG_FIELD_TYPE_COLORS[value]}>{t(`enum:${value}`)}</Tag>
    ),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: t('fields.table.columns.name'),
    width: 220,
  },
  {
    key: 'field_key',
    dataIndex: 'field_key',
    title: t('fields.table.columns.key'),
    width: 180 ,
  },
  {
    key: 'use_in_listing',
    dataIndex: 'use_in_listing',
    title: t('fields.table.columns.use-in-listing'),
    width: 120,
    render: (value: boolean) =>
      value ? t('fields.table.yes') : t('fields.table.no'),
  },
  {
    key: 'is_multilingual',
    dataIndex: 'is_multilingual',
    title: t('fields.table.columns.is-multilingual'),
    width: 130,
    render: (value: boolean) =>
      value ? t('fields.table.yes') : t('fields.table.no'),
  },
  {
    key: 'is_sortable',
    dataIndex: 'is_sortable',
    title: t('fields.table.columns.is-sortable'),
    width: 120,
    render: (value: boolean) =>
      value ? t('fields.table.yes') : t('fields.table.no'),
  },
  {
    key: 'is_searchable',
    dataIndex: 'is_searchable',
    title: t('fields.table.columns.is-searchable'),
    width: 120,
    render: (value: boolean) =>
      value ? t('fields.table.yes') : t('fields.table.no'),
  },
  {
    fixed: 'right',
    key: 'context_menu',
    dataIndex: 'context_menu',
    width: 60,
    render: (_, { id }: MappedCatalogTemplateField) => (
      <Dropdown
        onClick={(action: DropdownAction) => onClick && onClick(action, id)}
      />
    ),
  },
]
