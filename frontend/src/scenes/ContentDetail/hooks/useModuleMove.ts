import {
  ModuleProps,
  HeadingDataProps,
  CatalogListingDataProps,
  TextDataProps,
  ButtonDataProps,
  ImageDataProps,
  CatalogItemDataProps,
  CatalogCategoryTreeDataProps,
  CatalogCategoryDataProps,
  CatalogDetailDataProps,
  CatalogSearchDataProps,
} from '../types/Module'
import { ItemTypes } from '../types/ItemTypes'
import { DragItem } from '../types/DragItem'
import { useDrop } from 'react-dnd'
import uuid from 'uuid/v4'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { useContext } from 'react'
import { ContentDetailContext } from '..'
import { ButtonModuleTargetEnum } from 'model/api/ButtonModuleTargetEnum'
import { HeadingModuleLevelEnum } from 'model/api/HeadingModuleLevelEnum'

export interface UseModuleMoveProps {
  slotId: number
  locked: 0 | 1
}

export const useModuleMove = ({ slotId, locked }: UseModuleMoveProps) => {
  const { setIsTouched, setModules } = useContext(ContentDetailContext)

  const [{ isActive }, drop] = useDrop({
    accept: [ItemTypes.NEW_MODULE, ItemTypes.MODULE],
    canDrop: (_, monitor) => !locked && !monitor.getItem().locked,
    collect: monitor => ({
      isActive:
        monitor.canDrop() &&
        monitor.isOver({ shallow: true }) &&
        monitor.getItem().slotId !== slotId,
    }),
    drop: (item: DragItem, monitor) => {
      if (!!item.locked) return

      if (slotId === item.slotId) return

      if (monitor.didDrop()) {
        return
      }

      setIsTouched(true)

      if (item.type === ItemTypes.NEW_MODULE) {
        setModules(value => {
          const data: ModuleProps = {
            uuid: uuid(),
            slotId,
            isNew: true,
            isTouched: true,
            moduleType: item.moduleType,
            weight: 50,
            data: {},
            locked: false,
            isTemplatePageModule: false,
          }

          /**
           * Set initial data when new module is dropped
           */
          switch (item.moduleType) {
            case ModuleTypeEnum.TEXT:
              {
                const moduleData: TextDataProps = {
                  content: 'Text...',
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.HEADING:
              {
                const moduleData: HeadingDataProps = {
                  content: 'Heading...',
                  level: HeadingModuleLevelEnum.LEVEL_1,
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_ITEM:
              {
                const moduleData: CatalogItemDataProps = {
                  catalog_item_id: undefined,
                  language_code: null,
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_DETAIL:
              {
                const moduleData: CatalogDetailDataProps = {
                  catalog_item_id: null,
                  language_code: null,
                  catalog_item_id_variable_name: null,
                  load_from_global_context: false,
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_LISTING:
              {
                const moduleData: CatalogListingDataProps = {
                  category_id: null,
                  language_code: null,
                  category_id_variable_name: null,
                  sort: null,
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_CATEGORY_TREE:
              {
                const moduleData: CatalogCategoryTreeDataProps = {
                  parent_category_id: null,
                  display_if_parent_category_id: null,
                  language_code: null,
                  link_pattern: '',
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_CATEGORY:
              {
                const moduleData: CatalogCategoryDataProps = {
                  category_id: null,
                  language_code: null,
                  category_id_variable_name: null,
                  load_from_global_context: false,
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.CATALOG_SEARCH:
              {
                const moduleData: CatalogSearchDataProps = {
                  search_placeholder: '',
                  submit_label: '',
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.IMAGE:
              {
                const moduleData: ImageDataProps = {
                  file_name: '',
                  image: undefined,
                  image_alt: '',
                }

                data.data = moduleData
              }
              break
            case ModuleTypeEnum.BUTTON:
              {
                const moduleData: ButtonDataProps = {
                  button_id: undefined,
                  text: 'Button',
                  target: ButtonModuleTargetEnum.SELF,
                  path: '#',
                }

                data.data = moduleData
              }
              break
          }

          if (value[slotId] !== undefined) {
            return {
              ...value,
              [slotId]: [...value[slotId], data],
            }
          } else {
            return {
              ...value,
              [slotId]: [data],
            }
          }
        })
      } else if (item.type === ItemTypes.MODULE) {
        /**
         * Move existing module between slots
         */
        if (slotId !== item.slotId) {
          setModules(value => {
            const originalValue = { ...value }

            const draggedItem = originalValue[item.slotId].find(
              currentItem => currentItem.uuid === item.uuid
            ) as any

            if (!value[slotId]) {
              value[slotId] = []
            }

            value[slotId].push({ ...draggedItem, slotId })

            const newValue = {
              ...value,
              [item.slotId]: value[item.slotId].filter(
                currentItem => currentItem.uuid !== item.uuid
              ),
            }

            return newValue
          })
        } else {
          return
        }
      } else {
        return
      }
    },
  })

  return {
    drop,
    isActive,
  }
}
