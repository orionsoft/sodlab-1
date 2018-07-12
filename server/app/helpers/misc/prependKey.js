export default function(object, prepend) {
  const newObject = {}
  for (const key of Object.keys(object)) {
    newObject[`${prepend}.${key}`] = object[key]
  }
  return newObject
}
