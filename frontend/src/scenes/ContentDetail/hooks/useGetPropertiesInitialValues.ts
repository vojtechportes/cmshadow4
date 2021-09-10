import { ContentDetailContext } from '..'
import { FormValues } from '../components/DetailForm'
import { useContext } from 'react'

export const useGetPropertiesInitialValues = (): FormValues => {
  const { page } = useContext(ContentDetailContext)

  if (page) {
    return {
      name: page.name,
      path: page.path,
      parent: page.parent,
      template_id: page.template_id,
      meta_title: page.meta_title,
      meta_robots: page.meta_robots,
      meta_keywords: page.meta_keywords,
      meta_description: page.meta_description,
      meta_canonical: page.meta_canonical ? page.meta_canonical : undefined,
      meta_image: page.meta_image,
      html_head_end: page.html_head_end,
      html_body_start: page.html_body_start,
      html_body_end: page.html_body_end,
    }
  } else {
    return {
      name: undefined,
      path: undefined,
      parent: '',
      template_id: undefined,
      meta_title: undefined,
      meta_robots: undefined,
      meta_keywords: undefined,
      meta_description: undefined,
      meta_canonical: undefined,
      meta_image: null,
      html_head_end: undefined,
      html_body_start: undefined,
      html_body_end: undefined,
    }
  }
}
