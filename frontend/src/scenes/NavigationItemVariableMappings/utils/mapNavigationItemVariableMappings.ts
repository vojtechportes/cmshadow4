import { NavigationItemVariableMapping } from 'model/api/NavigationItemVariableMapping'

export interface MappedNavigationItemVariableMapping {
  key: string
  id: number
  variable_name: string
  value: string
}

export const mapNavigationItemVariableMapping = (
  data: NavigationItemVariableMapping[]
): MappedNavigationItemVariableMapping[] =>
  data.map(({ id, variable_name, value }) => ({
    key: String(id),
    id,
    variable_name,
    value,
  }))
