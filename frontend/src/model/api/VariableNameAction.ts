import { VariableNameActionActionEnm } from './VariableNameActionActionEnum'

export interface VariableNameAction {
  id: number
  variable_name: string
  path: string
  language_code: string | null
  action: VariableNameActionActionEnm
}
