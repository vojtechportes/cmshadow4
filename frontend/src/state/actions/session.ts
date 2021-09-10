import { createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { UserApi } from 'api/User'
import { SessionState } from 'state/reducers/session'
import { navigate } from '@reach/router'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const LOGOUT_CLEAR_STATE = 'LOGOUT_CLEAR_STATE'

export const requestLogin = createAction(REQUEST_LOGIN)
export const receiveLogin = createAction<boolean>(RECEIVE_LOGIN)
export const logoutClearState = createAction(LOGOUT_CLEAR_STATE)

export const login = (email: string, password: string) => async (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  dispatch(requestLogin())
  try {
    const data = new FormData()
    data.append('email', email)
    data.append('password', password)

    await UserApi.login(data)

    dispatch(receiveLogin(true))
  } catch (e) {
    dispatch(receiveLogin(false))
    throw e
  }
}

export const logout = () => async (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  const { PUBLIC_URL } = process.env

  await dispatch(forceLogout())
  navigate(PUBLIC_URL + '/')
}

export const forceLogout = () => async (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  await UserApi.logout()

  dispatch(logoutClearState())
}
