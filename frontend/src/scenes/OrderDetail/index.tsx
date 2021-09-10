import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { BackButton } from 'components/BackButton'
import { OrdersApi } from 'api/Orders'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { OrderDetail as OrderDetailInterface } from 'model/api/OrderDetail'
import { Space } from 'antd'
import { CatalogItem } from './components/CatalogItem'
import { History } from './components/History'
import { Info } from './components/Info'
import { Customer } from './components/Customer'

export interface OrderDetailProps extends RouteComponentProps {
  orderId?: number
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {
  const { t } = useTranslation('order-detail')
  const { setSceneTitle, setHasSidebar } = useContext(AuthenticatedLayoutContext)
  const [data, setData] = useState<OrderDetailInterface>()
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (orderId) {
        try {
          setLoading(true)

          const { data } = await OrdersApi.getOrder(orderId, {
            cancelToken,
          })

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [orderId, setLoading, setData]
  )

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t('scene-title.title')}
        extraContent={
          <BackButton title={t('scene-title.back-to-orders')} to="/orders" />
        }
      />
    )
  }, [setSceneTitle, t])

  useEffect(() => {
    setHasSidebar(false)

    return () => setHasSidebar(true)
  }, [setHasSidebar])

  useEffect(() => {
    const cancelTokenSource = cancelTokenRef.current

    getData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData])

  if (loading || !data) return null

  return (
    <Space size="middle" direction="vertical" style={{ width: '100%' }}>
      <Info data={data} />
      <Customer data={data} />
      <CatalogItem data={data} />
      <History data={data} />
    </Space>
  )
}
