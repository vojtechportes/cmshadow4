import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Input } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { MultiLingual } from './styles'

export interface StringProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const String: React.FC<StringProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(field, (name: string) => <Input name={name} />, language)
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => <Input name={name} />)
}
