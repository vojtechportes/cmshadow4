import { isLocalPath } from './isLocalPath'
import { StylesApi } from 'api/Styles'

export const resolveCssPaths = async (data: string, theme: string) => {
  const importPathRegex = new RegExp(/(@import ["'](.*)["'].*(?:;)?|@import url\(["'](.*)["']\).*(?:;)?)/, "gm")

  let match;
  const matchedPaths: any[] = [];

  do {
    match = importPathRegex.exec(data);

    if (match) {
      const path: string | undefined = match[2] || match[3];
      if (path && isLocalPath(path)) {
        let sanitizedPath = path

        if (path.startsWith("./")) {
          sanitizedPath = sanitizedPath.slice(2)
        }

        matchedPaths.push([sanitizedPath, match[0]])
      }
    }
  } while (match)

  if (matchedPaths.length > 0) {
    const replacedData = await matchedPaths.reduce(async (acc, current) => {
      try {
        const { data: currentData } = await StylesApi.getStyles(theme, current[0])

        return (await acc).replace(current[1], currentData)
      } catch (e) {
        return await acc
      }
    }, data)

    return replacedData
  }

  return data
}