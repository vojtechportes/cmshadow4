import { Action, handleActions } from 'redux-actions'
import Cookies from 'js-cookie'
import {
  LOGOUT_CLEAR_STATE,
  RECEIVE_LOGIN,
  REQUEST_LOGIN,
} from 'state/actions/session'

export interface SessionState {
  isLoggedIn: boolean
  isLoggingIn: boolean
}

const isLoggedIn = !!Cookies.get('AUTH_USER')

export const sessionInitialState: SessionState = {
  isLoggedIn,
  isLoggingIn: false,
}

export const sessionReducer = handleActions<SessionState, any>(
  {
    [REQUEST_LOGIN]: (state: SessionState): SessionState => ({
      ...state,
      isLoggingIn: true,
    }),

    [RECEIVE_LOGIN]: (
      state: SessionState,
      action: Action<boolean>
    ): SessionState => ({
      ...state,
      isLoggedIn: action.payload,
      isLoggingIn: false,
    }),

    [LOGOUT_CLEAR_STATE]: (state: SessionState): SessionState => ({
      ...state,
      isLoggedIn: false,
    }),
  },
  sessionInitialState
)    