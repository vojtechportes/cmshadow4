import { OrderStatusEnum } from 'model/api/OrderStatusEnum'

export interface OrderHistory {
  id: number
  order_id: number
  from_status: OrderStatusEnum
  to_status: OrderStatusEnum
  original_private_note: string
  new_private_note: string
  created_at: Date
}
