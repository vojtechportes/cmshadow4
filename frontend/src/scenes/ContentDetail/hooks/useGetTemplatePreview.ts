import { useSelector } from 'react-redux'
import { State } from 'state/rootReducer'
import { useCallback } from 'react'
import { TemplatePreview } from 'model/api/TemplatePreview'

export const useGetTemplatePreview = () => {
  const { previews } = useSelector((state: State) => state.templates)

  const getTemplatePreview = useCallback(
    (path: string, moduleName: string): TemplatePreview | undefined => {
      if (previews[path] && previews[path][moduleName]) {
        return previews[path][moduleName]
      }
    },
    [previews]
  )

  return { getTemplatePreview }
}
