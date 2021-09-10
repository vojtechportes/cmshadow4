import { OrderStatusEnum } from './OrderStatusEnum'

export interface Order {
  id: number
  customer: string
  catalog_item: string
  private_note: string
  created_at: Date
  modified_at: Date | null
  status: OrderStatusEnum
}
