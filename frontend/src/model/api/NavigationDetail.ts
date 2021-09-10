import { Navigation } from './Navigation'
import { NavigationItem } from './NavigationItem'

export interface NavigationDetail extends Navigation {
  items?: NavigationItem[]
}
