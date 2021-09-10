import React from 'react'
import { Order } from 'model/api/Order'
import { OrderCatalogItem } from 'model/api/OrderCatalogItem'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'
import { InfoItemProps, Info } from 'components/Info'
import { isJson } from 'utils/isJson'

export interface MappedOrder {
  key: string
  id: number
  status: OrderStatusEnum
  created_at: Date
  modified_at: Date | null
  catalog_item: OrderCatalogItem
}

export const renderDescription = ({ data: { fields }, id, currency, language }: OrderCatalogItem) => {
  const items = Object.keys(fields).reduce<InfoItemProps[]>(
    (acc, fieldName: string) => {
      console.log(fields[fieldName])

      if (!isJson(fields[fieldName].value) && fields[fieldName].value !== null) {
        acc.push({
          key: fieldName,
          label: fields[fieldName].name,
          value: <div dangerouslySetInnerHTML={{ __html: String(fields[fieldName].value) }} />,
        })
      }

      return acc
    },
    []
  )

  items.unshift({
    key: 'catalog_item_id',
    label: 'Catalog item ID',
    value: String(id)
  },{
    key: 'catalog_item_currency',
    label: 'Catalog item currency',
    value: currency ? String(currency.code) : '-'
  },
  {
    key: 'catalog_item_language',
    label: 'Catalog item language',
    value: String(language)
  })

  return <Info items={items} columns={1} />
}

export const mapOrders = (data: Order[]): MappedOrder[] =>
  data.map(({ id, catalog_item, status, created_at, modified_at }) => ({
    key: String(id),
    id,
    status: status as OrderStatusEnum,
    catalog_item: JSON.parse(catalog_item),
    created_at: new Date(created_at),
    modified_at: modified_at ? new Date(modified_at) : null,
    description: renderDescription(JSON.parse(catalog_item)),
  }))
