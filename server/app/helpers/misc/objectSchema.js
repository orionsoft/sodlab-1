export default function(array, fields) {
  const missingFieldItem = array.find(item => {
    return !fields.every(field => Object.keys(item).includes(field) && item[field] !== '')
  })
  return !!missingFieldItem
}
