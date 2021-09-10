import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Switch } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { MultiLingual } from './styles'

export interface BooleanProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Boolean: React.FC<BooleanProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(field, (name: string) => <Switch name={name} />, language)
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => <Switch name={name} />)
}
