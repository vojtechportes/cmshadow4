import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Input } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { MultiLingual } from './styles'

const { TextArea } = Input

export interface TextProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Text: React.FC<TextProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(
            field,
            (name: string) => <TextArea name={name} rows={4} />,
            language
          )
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => <TextArea name={name} rows={4} />)
}
