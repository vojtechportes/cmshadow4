import { HeadingModuleLevelEnum } from "./HeadingModuleLevelEnum";

export interface HeadingModule {
  parent_id: number
  level: HeadingModuleLevelEnum
  content: string
}