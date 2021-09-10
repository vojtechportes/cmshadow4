export const iterableEnum = <T>(t: T): {[key: string]: T[keyof T]} => {
  const keys = Object.keys(t) as [keyof T]
  return keys.reduce((agg, key) => Object.defineProperty(agg, key, {
      value: t[key],
      enumerable: !isFinite(+key)
    }), {})
}