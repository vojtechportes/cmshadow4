export const getExtraContentFieldValue = <T = {}>(
  values: any,
  name: string,
  language?: string
) => {
  if (!values.fields) return {}

  const fieldId = name.replace('[value]', '').match(/\[(.*)\]/)[1]
  const index = Object.keys(values.fields).find(key => key === fieldId)

  if (!!index) {
    const fieldValues = values.fields[index]

    if (language) {
      return (fieldValues[language].extra_content as T) || {}
    } else {
      return (fieldValues.extra_content as T) || {}
    }
  }

  return {}
}
