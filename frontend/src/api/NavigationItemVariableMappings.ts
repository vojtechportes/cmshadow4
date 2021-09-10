import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { PaginatedList } from 'model/api/PaginatedList'
import { NavigationItemVariableMapping } from 'model/api/NavigationItemVariableMapping'

export class NavigationsItemVariableMappingsApi {
  /**
   * Get Navigation Item Variable Mappings
   *
   * @param navigationId
   * @param navigationItemId
   * @param page
   * @param pageSize
   */
  static getNavigationItemVariableMappings(
    navigationId: number,
    navigationItemId: number,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<NavigationItemVariableMapping>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations/${navigationId}/items/${navigationItemId}/mappings`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get Navigation Item Variable Mapping
   *
   * @param navigationId
   * @param navigationItemId
   * @param navigationItemVariableMappingId
   */
  static getNavigationItemVariableMapping(
    navigationId: number,
    navigationItemId: number,
    navigationItemVariableMappingId: number,
    config?: RequestConfig
  ): AxiosPromise<NavigationItemVariableMapping> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations/${navigationId}/items/${navigationItemId}/mappings/${navigationItemVariableMappingId}`,
    })
  }

  /**
   * Create Navigation Item Variable Mapping
   *
   * @param navigationId
   * @param navigationItemId
   * @param data
   */
  static createNavigationItemVariableMapping(
    navigationId: number,
    navigationItemId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/navigations/${navigationId}/items/${navigationItemId}/mappings`,
      data,
    })
  }

  /**
   * Update Navigation Item Variable Mapping
   *
   * @param navigationId
   * @param navigationItemId
   * @param navigationItemVariableMappingId
   * @param data
   */
  static updateNavigationItemVariableMapping(
    navigationId: number,
    navigationItemId: number,
    navigationItemVariableMappingId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/navigations/${navigationId}/items/${navigationItemId}/mappings/${navigationItemVariableMappingId}`,
      data,
    })
  }

  /**
   * Delete Navigation Item Variable Mapping
   *
   * @param navigationId
   * @param navigationItemId
   * @param navigationItemVariableMappingId
   */
  static deleteNavigationItemVariableMapping(
    navigationId: number,
    navigationItemId: number,
    navigationItemVariableMappingId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/navigations/${navigationId}/items/${navigationItemId}/mappings/${navigationItemVariableMappingId}`,
    })
  }
}
