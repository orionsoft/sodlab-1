export default function(object, prepend, separator = '.') {
  const newObject = {}
  for (const key of Object.keys(object)) {
    newObject[`${prepend}${separator}${key}`] = object[key]
  }
  return newObject
}
