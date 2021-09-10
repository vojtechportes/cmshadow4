import React from 'react'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { CatalogItemPublic } from 'model/api/CatalogItemPublic'
import { JSXParser } from 'components/JSXParser'

export interface ListProps {
  data: CatalogItemPublic[]
}

export const List: React.FC<ListProps> = ({ data }) => {
  const { getTemplatePreview } = useGetTemplatePreview()

  return (
    <>
      {data.map(item => {
        const {
          id,
          data: { view_path, template_path, template_name },
        } = item
        const templatePreviewPath = `${view_path}/${template_path}`

        const templatePreview = getTemplatePreview(
          templatePreviewPath,
          template_name
        )

        if (templatePreview) {
          const { template } = templatePreview

          return (
            <JSXParser
              key={id}
              jsx={template}
              bindings={{ data: item }}
              components={{ List }}
              renderInWrapper={false}
              onError={e => console.log(e)}
            />
          )
        }

        return null
      })}
    </>
  )
}
