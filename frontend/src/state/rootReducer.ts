import { combineReducers } from 'redux'
import { PersistState } from 'redux-persist'
import {
  sessionReducer,
  sessionInitialState,
  SessionState,
} from 'state/reducers/session'
import { userInitialState, UserState, userReducer } from './reducers/user'
import {
  TemplatesState,
  templatesInitialState,
  templatesReducer,
} from './reducers/templates'

export interface State {
  session: SessionState
  user: UserState
  templates: TemplatesState
  _persist?: PersistState
}

export const initialState: State = {
  session: sessionInitialState,
  user: userInitialState,
  templates: templatesInitialState,
}

export const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  templates: templatesReducer,
})

export default rootReducer
