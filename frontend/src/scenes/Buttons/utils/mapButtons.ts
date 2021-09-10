import { Button } from 'model/api/Button'

export interface MappedButton {
  key: string
  id: number
  name: string
}

export const mapButtons = (data: Button[]): MappedButton[] =>
  data.map(({ id, name }) => ({
    key: String(id),
    id,
    name,
  }))
