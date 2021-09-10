import { TemplateDetail } from 'model/api/TemplateDetail'

export interface MappedTemplateDetail
  extends Omit<TemplateDetail, 'template_pages'> {
  template_pages?: number[]
}

export const mapTemplateDetail = ({
  template_pages,
  ...rest
}: TemplateDetail): MappedTemplateDetail => ({
  ...rest,
  template_pages: template_pages.reduce<number[]>((acc, { id }) => {
    acc.push(id)
    return acc
  }, []),
})
