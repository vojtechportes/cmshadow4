import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { ContentDetailContext } from '../'
import { Slot } from './Slot'
import { Styles } from './Styles'
import axios, { CancelToken } from 'axios'
import { StylesApi } from 'api/Styles'
import styled from 'styled-components'
import { SidePanel } from './SidePanel'
import { Skeleton } from 'antd'
import { resolveCssPaths } from '../utils/resolveCssPaths'

const Container = styled.div`
  position: relative;
  margin: 6px;
`

export const Editor: React.FC = () => {
  const { layoutSlots, view, loading } = useContext(ContentDetailContext)
  const [styles, setStyles] = useState<string>('')

  const getStyles = useCallback(
    async (cancelToken: CancelToken) => {
      if (view) {
        const { data } = await StylesApi.getStyles(view.path, 'main.css', {
          cancelToken,
        })

        const resolvedStyles = await resolveCssPaths(data, view.path)

        setStyles(resolvedStyles)
      }
    },
    [view]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getStyles(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getStyles])

  return useMemo(() => {
    if (loading) return <Skeleton paragraph={{ rows: 4, width: '100%' }} />

    return (
      <Container>
        <SidePanel />
        <div className="cms__editor">
          <Styles styles={styles}>
            {layoutSlots &&
              layoutSlots.map(data => <Slot data={data} key={data.id} />)}
          </Styles>
        </div>
      </Container>
    )
  }, [loading, styles, layoutSlots])
}
