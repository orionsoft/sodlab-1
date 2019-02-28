/**
 *
 *
 * @param {*} collectionFields  An array of all the fields from a collection
 * @param {*} data              The complete data of an item including its ID
 * @param {*} field             The name of the field to get the value from
 * @param {*} format            'string' or 'number'
 * @param {*} [fallback=null]   Fallback value to use when a string is '' or a number is 0
 * @returns                     A string or number
 */
export default function checkField(collectionFields, data, field, format, fallback = null) {
  const fieldValue = collectionFields.includes(field) ? data[field] : null

  if (!fieldValue) {
    if (fallback) return fallback
    const value = format === 'string' ? '' : 0
    return value
  }
  const value = format === 'string' ? fieldValue.toString() : parseInt(fieldValue, 10)
  if (fallback && !value) return fallback
  return value
}
