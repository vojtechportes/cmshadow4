import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { AuthenticatedRouter } from 'components/Router/AuthenticatedRouter'
import { useTrackPageView } from 'hooks/useTrackPageView'
import './i18n'
import { AnonymousRouter } from 'components/Router/AnonymousRouter'
import { useSelector } from 'react-redux'
import { State } from 'state/rootReducer'

const App: React.FC = () => {
  const { t } = useTranslation()
  const { location, setTrackPageView } = useTrackPageView()
  const { isLoggedIn } = useSelector((state: State) => state.session)

  useEffect(() => {
    setTrackPageView()
  }, [location, setTrackPageView])

  return (
    <>
      <Helmet>
        <title>{t('html-title')}</title>
      </Helmet>
      {!isLoggedIn ? <AnonymousRouter /> : <AuthenticatedRouter />}
    </>
  )
}

export default App
