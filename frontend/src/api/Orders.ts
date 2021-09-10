import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { PaginatedList } from 'model/api/PaginatedList'
import { Order } from 'model/api/Order'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'
import { OrderDetail } from 'model/api/OrderDetail'

export class OrdersApi {
  /**
   * Get Orders
   *
   * @param status
   * @param page
   * @param pageSize
   */
  static getOrders(
    status?: string,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Order>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/orders`,
      params: {
        status,
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get Order
   *
   * @param orderId
   */
  static getOrder(
    orderId: number,
    config?: RequestConfig
  ): AxiosPromise<OrderDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/orders/${orderId}`,
    })
  }  

  /**
   * Change Order status
   *
   * @param orderId
   * @param status
   */
  static changeOrderStatus(
    orderId: number,
    status: OrderStatusEnum,
    silent?: boolean,
    config?: RequestConfig
  ): AxiosPromise<void> {
    return axios({
      ...config,
      method: 'PUT',
      params: {
        status,
        silent: Number(silent),
      },
      url: `/orders/${orderId}/transition`,
    })
  }  

  /**
   * Change order note
   *
   * @param orderId
   * @param data
   */
  static changeOrderNote(
    orderId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<void> {
    return axios({
      ...config,
      method: 'PUT',
      data,
      url: `/orders/${orderId}/note`,
    })
  }  

  /**
   * Delete order
   *
   * @param orderId
   * @param status
   */
  static deleteOrder(
    orderId: number,
    config?: RequestConfig
  ): AxiosPromise<void> {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/orders/${orderId}`,
    })
  }  
}
