export default function(array, fields) {
  const missingFieldItem = array.find(item => {
    return !fields.every(field => !!item[field])
  })
  return !!missingFieldItem
}
