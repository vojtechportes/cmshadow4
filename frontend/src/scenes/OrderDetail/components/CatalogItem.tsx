import React from 'react'
import { OrderDetail } from 'model/api/OrderDetail'
import { Typography } from 'antd'
import { renderDescription } from 'scenes/Orders/utils/mapOrders'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export interface CatalogItemProps {
  data: OrderDetail
}

export const CatalogItem: React.FC<CatalogItemProps> = ({
  data: { catalog_item },
}) => {
  const { t } = useTranslation('order-detail')
  const catalogItemDescription = renderDescription(JSON.parse(catalog_item))

  return (
    <>
      <Title level={4}>{t('catalog-item.title')}</Title>
      {catalogItemDescription}
    </>
  )
}
