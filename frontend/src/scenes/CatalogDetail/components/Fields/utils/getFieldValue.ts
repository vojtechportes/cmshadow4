export const getFieldValue = <T>(values: any, fieldId: number, language?: string) => {
  if (!values.fields) return

  const index = Object.keys(values.fields).find(key => Number(key) === fieldId)

  if (!!index) {
    let fieldValues = values.fields[index]

    if (language) {
      fieldValues = fieldValues[language]
    }

    return fieldValues.value as T
  }
}
