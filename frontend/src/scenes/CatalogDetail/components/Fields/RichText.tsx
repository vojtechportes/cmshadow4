import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { RichTextFormik } from 'components/RichTextFormik'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { MultiLingual } from './styles'

export interface RichTextProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const RichText: React.FC<RichTextProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(
            field,
            (name: string) => (
              <RichTextFormik name={name} />
            ),
            language
          )
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => (
    <RichTextFormik name={name} />
  ))
}
