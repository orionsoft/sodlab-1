import moment from 'moment'

/**
 *
 * @export
 * @param {*} obj
 * @returns       If the passed object is a date, it returns it parsed like DD-MM-YYYY, if not, it returns the original object
 */
export default function(result, comparingValue, valueToCheck) {
  const resultIsDate = moment.isDate(result)
  const comparingValueIsDate = moment.isDate(comparingValue)
  const pass = resultIsDate || comparingValueIsDate
  if (pass) {
    const parsedDate = new Date(result.setHours(0, 0, 0, 0))
    const date = moment(parsedDate)
      .format('DD-MM-YYYY')
      .toString()
    return date
  } else {
    return valueToCheck
  }
}
