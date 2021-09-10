import { useCallback, useContext } from 'react'
import { ContentDetailContext } from '..'

export interface UseDeleteModuleProps {
  isNew: boolean
  slotId: number
  uuid: string
  moduleId?: number
}

export const useDeleteModule = ({
  isNew,
  uuid,
  moduleId,
  slotId,
}: UseDeleteModuleProps) => {
  const { setModules, setDeletedModules, setIsTouched } = useContext(
    ContentDetailContext
  )

  return useCallback(() => {
    if (!isNew && moduleId) {
      setDeletedModules(values => {
        values.push(moduleId)

        return values
      })

      setIsTouched(true)
    }

    setModules(values => ({
      ...values,
      [slotId]: values[slotId].filter(module => module.uuid !== uuid),
    }))
  }, [setModules, setDeletedModules, isNew, slotId, uuid, moduleId])
}
