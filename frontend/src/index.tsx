// import { addIconsToLibrary } from 'constants/icons'
import initializeTracking from 'tracking'
import GlobalStyle from 'GlobalStyle'
import 'i18n'
import App from 'App'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
  configureAxiosInterceptors,
  configureMessageHandleAxiosInterceptors,
} from 'axiosConfig'
import { addIconsToLibrary } from 'constants/icons'
import { AuthenticatedLoadingLayout } from 'components/Layout/AuthenticatedLoadingLayout'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from 'state/store'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

configureAxiosInterceptors()
configureMessageHandleAxiosInterceptors(store)
addIconsToLibrary()
initializeTracking()

ReactDOM.render(
  <DndProvider backend={Backend}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <Suspense fallback={<AuthenticatedLoadingLayout />}>
          <App />
          <GlobalStyle />
        </Suspense>
      </PersistGate>
    </Provider>
  </DndProvider>,
  document.getElementById('root')
)
