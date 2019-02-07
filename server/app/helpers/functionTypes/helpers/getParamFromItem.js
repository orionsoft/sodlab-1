export function getParamFromItem(fieldValueToLookFor, item) {
  if (!fieldValueToLookFor) return fieldValueToLookFor
  if (fieldValueToLookFor.includes('item.')) {
    const param = fieldValueToLookFor.replace('item.', '')
    if (param === '_id') {
      return item._id
    }
    return item.data[param]
  }
  return fieldValueToLookFor
}
