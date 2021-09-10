import React, {
  useContext,
  useEffect,
  createContext,
  useState,
  useRef,
  useCallback,
} from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { BackButton } from 'components/BackButton'
import { CatalogItemsApi } from 'api/CatalogItems'
import axios, { CancelTokenSource } from 'axios'
import { CreateForm } from './components/CreateForm'
import { CatalogItemDetail } from 'model/api/CatalogItemDetail'
import { DetailInfo } from './components/DetailInfo'
import { Form } from './components/Form'

export interface CatalogDetailContextProps {
  data: CatalogItemDetail | undefined
  getData: () => Promise<void>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const CatalogDetailContext = createContext(
  {} as CatalogDetailContextProps
)

export interface CatalogDetailProps extends RouteComponentProps {
  catalogItemId?: number
  view: 'new' | 'detail'
}

export const CatalogDetail: React.FC<CatalogDetailProps> = ({
  catalogItemId,
  view,
}) => {
  const { t } = useTranslation('catalog-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CatalogItemDetail>()
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    if (catalogItemId && view === 'detail') {
      setLoading(true)

      const { data } = await CatalogItemsApi.getCatalogItem(catalogItemId, {
        cancelToken: cancelTokenRef.current.token,
      })

      setData(data)
      setLoading(false)
    }
  }, [catalogItemId, view])

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-catalog-items')}
            to="/catalog"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  if (view === 'new') {
    return <CreateForm />
  } else {
    return (
      <CatalogDetailContext.Provider
        value={{ data, getData, loading, setLoading }}
      >
        <DetailInfo />
        <Form />
      </CatalogDetailContext.Provider>
    )
  }
}
