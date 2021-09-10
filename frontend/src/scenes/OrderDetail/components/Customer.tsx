import React, { useMemo } from 'react'
import { Info as BaseInfo, InfoItemProps } from 'components/Info'
import { OrderDetail } from 'model/api/OrderDetail'
import { Typography, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { OrderCustomer } from 'model/api/OrderCustomer'

const { Title } = Typography

export interface CustomerProps {
  data: OrderDetail
}

export const Customer: React.FC<CustomerProps> = ({ data: { customer } }) => {
  const { t } = useTranslation('order-detail')
  const parsedCustomer = JSON.parse(customer) as OrderCustomer

  const items = useMemo(
    () =>
      Object.keys(parsedCustomer).map<InfoItemProps>(field => ({
        key: field,
        label: field,
        value: parsedCustomer[field],
      })),
    [parsedCustomer]
  )

  return (
    <>
      <Title level={4}>{t('customer.title')}</Title>
      <BaseInfo items={items} columns={2} />
    </>
  )
}
