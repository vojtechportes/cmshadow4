import { AxiosRequestConfig } from 'axios'

export interface ApiRequestConfig extends AxiosRequestConfig {
  successHandlerEnabled?: boolean
  errorHandlerDisabled?: boolean
}

export type RequestConfig = Pick<
  ApiRequestConfig,
  Exclude<
    keyof ApiRequestConfig,
    'method' | 'url' | 'data' | 'params' | 'responseType'
  >
>
