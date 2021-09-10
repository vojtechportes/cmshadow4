import React from 'react'
import axios, { AxiosError } from 'axios'
import { notification } from 'antd'
import { ApiRequestConfig } from 'api/requestConfig'
import { navigate } from '@reach/router'
import Cookies from 'js-cookie'
import { AUTHORIZATION_HEADER } from 'constants/http'
import { Store } from 'redux'
import { State } from 'state/rootReducer'
import { logoutClearState } from 'state/actions/session'

const isErrorHandlerDisabled = (config: ApiRequestConfig) => {
  return config && config.errorHandlerDisabled
}

const errorHandler = (error: AxiosError<any>, store: Store<State, any>) => {
  const { PUBLIC_URL } = process.env

  if (error.response && !axios.isCancel(error)) {
    if (isErrorHandlerDisabled(error.config)) {
      return Promise.reject({ ...error })
    }

    if (error.response) {
      if (error.response.status === 500) {
        navigate(PUBLIC_URL + '/status/internal-server-error')
      } else if (error.response.status === 405) {
        notification.error({
          message: <>405 Method not allowed</>,
          duration: 10,
        })
      } else if (error.response.status === 401) {
        store.dispatch(logoutClearState())
      } else {
        if (typeof error.response.data === 'object') {
          const extractedErrors = []
          const errors = error.response.data

          Object.keys(errors).forEach((key: string) => {
            errors[key].forEach((error: string) => {
              extractedErrors.push(error)
            })
          })

          notification.error({
            message: (
              <>
                {extractedErrors.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </>
            ),
            duration: 10,
          })

          return Promise.reject({ ...error })
        }
      }
    }
  }

  throw error
}

export const configureAxiosInterceptors = () => {
  const { CMS_BASE_URL } = window._envConfig

  const requestInterceptor = axios.interceptors.request.use(config => ({
    ...config,
    baseURL: CMS_BASE_URL,
    headers: {
      [AUTHORIZATION_HEADER]: `Bearer ${Cookies.get('AUTH_USER')}`,
      Credentials: 'same-origin'
    }
  }))

  return {
    request: [requestInterceptor],
  }
}

export const configureMessageHandleAxiosInterceptors = (store: Store<State, any>) => {
  const responseInterceptor = axios.interceptors.response.use(
    success => success,
    error => errorHandler(error, store)
  )
  return { response: responseInterceptor }
}
