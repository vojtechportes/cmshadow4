import { useEffect, useState, useCallback } from 'react'
import { Template } from 'model/api/Template'
import axios, { CancelToken } from 'axios'
import { TemplatesApi } from 'api/Templates'
import { PagesApi } from 'api/Pages'
import { mapPages, MappedPage } from 'mappers/mapPages'

export const useGetPropertiesData = () => {
  const [pages, setPages] = useState<MappedPage[]>()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)

  const getTemplates = useCallback(async (cancelToken: CancelToken) => {
    try {
      setLoading(true)
      const { data } = await TemplatesApi.getAllTemplates({ cancelToken })

      setTemplates(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [])

  const getAllPages = useCallback(
    async (cancelToken: CancelToken) => {
      try {
        setLoading(true)
        const { data } = await PagesApi.getAllPages({ cancelToken })

        setPages(mapPages(data))
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getTemplates(cancelTokenSource.token)
    getAllPages(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getTemplates, getAllPages])

  return {
    pages,
    templates,
    loading,
  }
}
