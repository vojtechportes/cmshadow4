import { CatalogItemFieldData } from 'model/api/CatalogItemDetailFieldData'
import { isFieldValueMultilingual } from 'types/isFieldValueMultilingual'
import { CatalogDetailContext } from '..'
import { useContext } from 'react'

export const useGetInitialValues = () => {
  const { data } = useContext(CatalogDetailContext)

  const initialValues = { fields: {}, categories: [] }

  if (data) {
    initialValues.categories = data.categories

    data.fields.forEach(field => {
      const { is_multilingual, id } = field

      if (!!is_multilingual) {
        const fieldData = field.data as { [key: string]: CatalogItemFieldData }

        initialValues.fields[id] = {}

        Object.keys(fieldData).forEach(language => {
          initialValues.fields[id][language] = {}

          initialValues.fields[id][language]['value'] =
            fieldData[language] && fieldData[language].value
              ? fieldData[language].value
              : undefined
          initialValues.fields[id][language]['extra_content'] =
            fieldData[language] && fieldData[language].extra_content
              ? fieldData[language].extra_content
              : undefined
        })
      } else {
        const fieldData: CatalogItemFieldData | null = !isFieldValueMultilingual(
          field.data
        )
          ? field.data
          : null

        initialValues.fields[id] = {}

        initialValues.fields[id]['value'] =
          fieldData && fieldData.value ? fieldData.value : undefined
        initialValues.fields[id]['extra_content'] =
          fieldData && fieldData.extra_content
            ? fieldData.extra_content
            : undefined
      }
    })
  }

  return initialValues
}
