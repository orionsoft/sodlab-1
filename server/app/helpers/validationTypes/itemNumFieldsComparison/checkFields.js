import numeral from 'numeral'

/**
 *
 * @export
 * @param {*} {validationType, data, fields, valueToCheck, checkForTruthy}
 * @returns
 */
export default function({validationType, data, fields, valueToCheck, checkForTruthy}) {
  let failReason = ''
  let conditionIsMet
  const failedFields = fields.map(field => {
    if (!Object.keys(data).includes(field)) return field

    const value = numeral(data[field]).value()
    switch (validationType) {
      case 'biggerOrEqualThan': {
        conditionIsMet = value >= valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser mayor o igual "{{valueToCheck}}"`
          : `debe(n) ser mayor o igual a "{{valueToCheck}}"`
        break
      }
      case 'biggerThan': {
        conditionIsMet = value > valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser mayor a "{{valueToCheck}}"`
          : `debe(n) ser mayor a "{{valueToCheck}}"`
        break
      }
      case 'equalTo': {
        conditionIsMet = value === valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser igual a "{{valueToCheck}}"`
          : `debe(n) ser igual a "{{valueToCheck}}"`
        break
      }
      case 'notEqualTo': {
        conditionIsMet = value !== valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser distintos a "{{valueToCheck}}"`
          : `debe(n) ser distintos a "{{valueToCheck}}"`
        break
      }
      case 'smallerThan': {
        conditionIsMet = value < valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser menor a "{{valueToCheck}}"`
          : `debe(n) ser menor a "{{valueToCheck}}"`
        break
      }
      case 'smallerOrEqualThan': {
        conditionIsMet = value <= valueToCheck
        failReason = checkForTruthy
          ? `no debe(n) ser menor o igual a "{{valueToCheck}}"`
          : `debe(n) ser menor o igual a "{{valueToCheck}}"`
        break
      }
      default:
        break
    }

    if (checkForTruthy) {
      if (conditionIsMet) return field
    } else {
      if (!conditionIsMet) return field
    }
  })

  return {failedFields, failReason}
}
