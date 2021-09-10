export const getExtraContentFieldName = (name: string): string => {
  return name.replace('[value]', '[extra_content]')
}
