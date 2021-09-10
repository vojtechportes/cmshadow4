import { useState, useRef, useCallback, useEffect } from 'react'
import { PagesApi } from 'api/Pages'
import axios, { CancelTokenSource } from 'axios'
import { MappedPageVersion, mapPageVersions } from '../utils/mapPageVersions'

export interface UseGetPageVersionsProps {
  identifier: string
  view: 'new' | 'detail'
}

export const useGetPageVersions = ({
  view,
  identifier,
}: UseGetPageVersionsProps) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0)
  const [pageVersions, setPageVersions] = useState<MappedPageVersion[]>()
  const cancelTokenSourceRef = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  )

  const getPageVersions = useCallback(
    async () => {
      if (view === 'detail') {
        setLoading(true)

        const {
          data: { data, total, per_page },
        } = await PagesApi.getPageVersions(identifier, page, pageSize, {
          cancelToken: cancelTokenSourceRef.current.token,
        })

        setPageVersions(mapPageVersions(data))
        setTotal(total)
        setPageSize(per_page)
        setLoading(false)
      }
    },
    [identifier, view, page, pageSize]
  )

  useEffect(() => {
    const cancelTokenSource = cancelTokenSourceRef.current

    return () => cancelTokenSource.cancel()
  }, [])

  return {
    pageVersions,
    getPageVersions,
    loading,
    page,
    setPage,
    total,
    pageSize,
    setPageSize,
  }
}
