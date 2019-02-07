/**
 *
 * @param   {Object}  data
 * @param   {Array}   fields
 * @param   {Object}  regex                 A regex expression
 * @param   {Boolean} checkForTruthy
 * @returns {Array}   An array of Strings
 */
export default function({data, fields, regex, checkForTruthy}) {
  return fields.map(field => {
    if (!Object.keys(data).includes(field)) return field

    const value = data[field].toString()
    const conditionIsMet = regex.test(value)

    if (checkForTruthy) {
      if (conditionIsMet) return field
    } else {
      if (!conditionIsMet) return field
    }
  })
}
