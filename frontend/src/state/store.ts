import { rootReducer, initialState, State } from './rootReducer'
import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import {
  MigrationManifest,
  PersistConfig,
  PersistedState,
} from 'redux-persist/es/types'
import createDebounce from 'redux-debounced'
import { sessionInitialState } from 'state/reducers/session'
import { userInitialState } from './reducers/user'
import { templatesInitialState } from './reducers/templates'

export const STORE_VERSION = 1

const migrations: MigrationManifest = {
  1: (state: PersistedState) => {
    if (state) {
      return {
        ...state,
        session: sessionInitialState,
        user: userInitialState,
        templates: templatesInitialState,
      }
    }
  },
}

const persistConfig: PersistConfig<State> = {
  key: 'root',
  version: STORE_VERSION,
  storage,
  whitelist: ['user', 'templates'],
  migrate: createMigrate(migrations, {
    debug: process.env.NODE_ENV === 'development',
  }),
}

const configureStore = (): Store<State, any> =>
  createStore(
    persistReducer(persistConfig, rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(createDebounce(), thunk))
  )

export const store = configureStore()
