import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { ButtonModuleTargetEnum } from 'model/api/ButtonModuleTargetEnum'
import { UploadFile } from 'antd/lib/upload/interface'
import { HeadingModuleLevelEnum } from 'model/api/HeadingModuleLevelEnum'

export interface HeadingDataProps {
  content: string
  level: HeadingModuleLevelEnum
}

export interface ButtonDataProps {
  button_id: number | undefined
  text: string | undefined
  path: string | undefined
  target: ButtonModuleTargetEnum | undefined
}

export interface NavigationDataProps {
  navigation_id: number | undefined
}

export interface TextDataProps {
  content: string
}

export interface HtmlDataProps {
  content: string
}

export interface CatalogItemDataProps {
  catalog_item_id: number | undefined
  language_code: string | null
}

export interface CatalogDetailDataProps {
  catalog_item_id: number
  language_code: string | null
  catalog_item_id_variable_name: string | null
  load_from_global_context: boolean
}

export interface CatalogSearchDataProps {
  search_placeholder: string
  submit_label: string
}

export interface CatalogCategoryTreeDataProps {
  parent_category_id: number | null
  display_if_parent_category_id: number | null
  language_code: string | null
  link_pattern: string
}

export interface CatalogCategoryDataProps {
  category_id: number
  language_code: string | null
  category_id_variable_name: string | null
  load_from_global_context: boolean
}

export interface CatalogListingDataProps {
  language_code: string | null
  category_id: number | null
  category_id_variable_name: string | null
  sort: string | null
}

export interface CatalogSearchDataProps {
  search_placeholder: string
  submit_label: string
}

export interface ImageDataProps {
  file_name: string
  image?: UploadFile
  image_alt: string
}

export interface ModuleProps {
  uuid: string
  slotId: number
  isTouched: boolean
  isNew: boolean
  moduleId?: number
  moduleType: ModuleTypeEnum
  weight: number
  data: any
  locked?: boolean
  isTemplatePageModule?: boolean
}
