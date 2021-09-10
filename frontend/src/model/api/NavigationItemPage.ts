import { PageStatusEnum } from "./PageStatusEnum";

export interface NavigationItemPage {
  identifier: string
  path: string
  published_path: string | null
  status: PageStatusEnum
  name: string
  is_published: 0 | 1
}