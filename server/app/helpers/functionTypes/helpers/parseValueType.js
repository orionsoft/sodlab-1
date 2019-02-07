export function parseValueType(valueType, value) {
  if (valueType === 'string') return value.toString()
  if (valueType === 'number') return parseInt(value, 10)
  if (valueType === 'boolean') {
    if (value == 'true') return true
    return false
  }
  return value
}
