export const isJson = (data: string) => {
  try {
    const parsedData = JSON.parse(data)

    if (typeof parsedData !== 'object') {
      throw new Error()
    }
  } catch (e) {
    return false
  }

  return true
}
