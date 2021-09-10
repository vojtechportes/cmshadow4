import React from 'react'
import { OrderHistory } from 'model/api/OrderHistory'
import i18next from 'i18next'
import { Info } from 'components/Info'

export interface MappedOrderHistory {
  key: string
  from_status: string
  to_status: string
  created_at: Date
  description: React.ReactNode
}

export const mapOrderHistory = (
  data: OrderHistory[],
  t: i18next.TFunction
): MappedOrderHistory[] =>
  data.map(
    ({ id, from_status, to_status, created_at, original_private_note, new_private_note }) => ({
      key: String(id),
      from_status,
      to_status,
      created_at: new Date(created_at),
      description: (
        <Info
          columns={2}
          items={[
            {
              key: 'original_note',
              label: t('history.table.columns.description.original-private-note'),
              value: (
                <div dangerouslySetInnerHTML={{ __html: original_private_note }} />
              ),
            },
            {
              key: 'new_note',
              label: t('history.table.columns.description.new-private-note'),
              value: <div dangerouslySetInnerHTML={{ __html: new_private_note }} />,
            },
          ]}
        />
      ),
    })
  )
