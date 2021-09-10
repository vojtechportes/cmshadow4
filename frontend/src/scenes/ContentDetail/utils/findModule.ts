import { ModulesProps } from '../hooks/useGetPageData'

export const findModule = (
  modules: ModulesProps,
  slotId: number,
  uuid: string
) => {
  const module = modules[slotId].find(
    currentModule => currentModule.uuid === uuid
  )

  return {
    module,
    index: modules[slotId].indexOf(module)
  }
}
