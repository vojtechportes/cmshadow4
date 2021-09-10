import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { LayoutSlot } from 'model/api/LayoutSlot'
import { LayoutSlotDetail } from 'model/api/LayoutSlotDetail'

export class LayoutSlotsApi {
  /**
   * Get Layout Slots
   *
   * @param layoutId
   */
  static getLayoutSlots(
    layoutId: number,
    config?: RequestConfig
  ): AxiosPromise<LayoutSlot[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layout-slots`,
      params: {
        layout_id: layoutId
      }
    })
  }

  /**
   * Get All Layout Slots
   *
   * @param layoutId
   */
  static getAllLayoutSlots(
    layoutId: number,
    config?: RequestConfig
  ): AxiosPromise<LayoutSlot[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layout-slots/all`,
      params: {
        layout_id: layoutId
      }
    })
  }

  /**
   * Get Layout Slot
   *
   */
  static getLayoutSlot(
    layoutSlotId: number,
    config?: RequestConfig
  ): AxiosPromise<LayoutSlotDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layout-slots/${layoutSlotId}`,
    })
  }

  /**
   * Create Layout Slot
   *
   * @param data
   */
  static createLayoutSlot(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/layout-slots`,
      data
    })
  }

  /**
   * Update Layout Slot
   *
   * @param layoutSlotId
   */
  static updateLayoutSlot(
    layoutSlotId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/layout-slots/${layoutSlotId}`,
      data
    })
  }

  /**
   * Delete Layout Slot
   *
   * @param layoutSlotId
   */
  static deleteLayoutSlot(
    layoutSlotId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/layout-slots/${layoutSlotId}`,
    })
  }
}