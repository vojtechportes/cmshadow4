import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'

export class CatalogItemTemplateFieldValuesApi {
  /**
   * Update Catalog Item Template Field values
   *
   * @param catalogItemId
   * @param data
   */
  static updateCatalogItemTemplateFieldValues(
    catalogItemTemplateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-item-templates/${catalogItemTemplateId}/values`,
      data,
    })
  }
}
