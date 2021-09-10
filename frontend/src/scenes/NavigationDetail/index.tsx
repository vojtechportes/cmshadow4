import React, {
  useContext,
  useEffect,
  createContext,
  useState,
  useCallback,
} from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { Items } from './components/Items'
import { NavigationDetail as NavigationDetailInterface } from 'model/api/NavigationDetail'
import axios, { CancelToken } from 'axios'
import { NavigationsApi } from 'api/Navigations'

export interface NavigationDetailContextProps {
  view: 'new' | 'detail'
  navigationId: number
  navigation?: NavigationDetailInterface
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const NavigationDetailContext = createContext<
  NavigationDetailContextProps
>({} as NavigationDetailContextProps)

export interface NavigationDetailProps extends RouteComponentProps {
  navigationId?: number
  view: 'new' | 'detail'
}

export const NavigationDetail: React.FC<NavigationDetailProps> = ({
  navigationId,
  view,
}) => {
  const { t } = useTranslation('navigation-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const [navigation, setNavigation] = useState<NavigationDetailInterface>()
  const [loading, setLoading] = useState(false)

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && navigationId) {
        try {
          setLoading(true)

          const { data } = await NavigationsApi.getNavigation(navigationId, {
            cancelToken,
          })

          setNavigation(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, navigationId]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData])

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-navigations')}
            to="/content/modules/navigations"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  return (
    <NavigationDetailContext.Provider
      value={{ view, navigationId, navigation, loading, setLoading }}
    >
      <Form />
      {view === 'detail' && <Items />}
    </NavigationDetailContext.Provider>
  )
}
