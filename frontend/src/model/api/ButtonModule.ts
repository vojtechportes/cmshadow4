import { ButtonModuleTargetEnum } from './ButtonModuleTargetEnum'

export interface ButtonModule {
  parent_id: number
  text: string
  path: string
  target: ButtonModuleTargetEnum
  button_id: number
}