import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Module } from 'model/api/Module'

export class ModulesApi {
  /**
   * Get Modules
   *
   * @param pageIdentifier
   * @param pageVersion
   * @param layoutId
   * @param templatePageIds
   */
  static getModules(
    pageIdentifier: string,
    pageVersion: number,
    layoutId: number,
    templatePageIds?: number[],
    config?: RequestConfig
  ): AxiosPromise<Module[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/modules`,
      params: {
        page_identifier: pageIdentifier,
        page_version: pageVersion,
        layout_id: layoutId,
        template_page_ids: templatePageIds,
      },
    })
  }
}
