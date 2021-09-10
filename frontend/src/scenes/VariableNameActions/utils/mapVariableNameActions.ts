import { VariableNameActionActionEnm } from 'model/api/VariableNameActionActionEnum'
import { VariableNameAction } from 'model/api/VariableNameAction'

export interface MappedVariableNameAction {
  key: string
  id: number
  variable_name: string
  path: string
  action: VariableNameActionActionEnm
}

export const mapVariableNameActions = (
  data: VariableNameAction[]
): MappedVariableNameAction[] =>
  data.map(({ id, variable_name, path, action }) => ({
    key: String(id),
    id,
    variable_name,
    path,
    action,
  }))
