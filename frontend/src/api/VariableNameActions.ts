import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { VariableNameAction } from 'model/api/VariableNameAction'
import { PaginatedList } from 'model/api/PaginatedList'

export class VariableNameActionsApi {
  /**
   * Get Variable Name Actions
   *
   * @param page
   * @param pageSize
   */
  static getVariableNameActions(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<VariableNameAction>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/variable-name-actions`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get Variable Name Action
   *
   * @param variableNameActionId
   */
  static getVariableNameAction(
    variableNameActionId: number,
    config?: RequestConfig
  ): AxiosPromise<VariableNameAction> {
    return axios({
      ...config,
      method: 'GET',
      url: `/variable-name-actions/${variableNameActionId}`,
    })
  }

  /**
   * Create Variable Name Action
   *
   * @param data
   */
  static createVariableNameAction(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/variable-name-actions`,
      data
    })
  }

  /**
   * Update Variable Name Action
   *
   * @param variableNameActionId
   * @param data
   */
  static updateVariableNameAction(
    variableNameActionId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/variable-name-actions/${variableNameActionId}`,
      data
    })
  }

  /**
   * Delete Variable Name Action
   *
   * @param variableNameActionId
   */
  static deleteVariableNameAction(
    variableNameActionId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/variable-name-actions/${variableNameActionId}`,
    })
  }
}