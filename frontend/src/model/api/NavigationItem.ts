import { NavigationItemTargetEnum } from './NavigationItemTargetEnum'
import { NavigationItemPage } from './NavigationItemPage'

export interface NavigationItem {
  id: number
  navigation_id: number
  parent_id: number | null
  title: string
  page_identifier: string | null
  path: string | null
  target: NavigationItemTargetEnum
  html_class_name: string | null
  html_id: string | null
  weight: number
  page?: NavigationItemPage
  children?: NavigationItem[]
}
