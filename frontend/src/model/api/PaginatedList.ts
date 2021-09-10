export interface PaginatedList<T> {
  current_page: number
  data: T[],
  first_page_url: string | null
  form: number
  last_page: number
  last_page_url: string | null
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}