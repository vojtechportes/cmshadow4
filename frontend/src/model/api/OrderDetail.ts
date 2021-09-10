import { OrderHistory } from './OrderHistory'
import { Order } from './Order'

export interface OrderDetail extends Order {
  history: OrderHistory[]
}
