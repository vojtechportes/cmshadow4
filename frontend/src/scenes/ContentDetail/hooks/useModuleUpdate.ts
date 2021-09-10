import { ContentDetailContext } from '../'
import { useContext, useCallback } from 'react'

export interface UseModuleUpdateProps<DT> {
  uuid: string
  slotId: number
  onUpdate?: () => void
}

export const useModuleUpdate = <DT>({
  uuid,
  slotId,
  onUpdate,
}: UseModuleUpdateProps<DT>) => {
  const { setModules, setIsTouched } = useContext(ContentDetailContext)

  const update = useCallback(
    (data: Partial<DT>, mutate: boolean = false) => {
      setModules(value => {
        const modules = mutate ? { ...value } : value
        const currentModule = modules[slotId].find(
          currentValue => currentValue.uuid === uuid
        )
        const currentModuleIndex = modules[slotId].findIndex(
          currentValue => currentValue.uuid === uuid
        )

        if (currentModule) {
          modules[slotId][currentModuleIndex].isTouched = true
          modules[slotId][currentModuleIndex].data = {
            ...currentModule.data,
            ...data,
          }

          return modules
        }

        return value
      })

      setIsTouched(true)

      onUpdate && onUpdate()
    },
    [setModules, setIsTouched, onUpdate, slotId, uuid]
  )

  return { update }
}
