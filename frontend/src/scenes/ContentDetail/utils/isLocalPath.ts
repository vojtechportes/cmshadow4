export const isLocalPath = (path: string) => {
  const absolutPathRegex = new RegExp(/^(?:[a-z]+:)?\/\//)

  return !absolutPathRegex.test(path)
}