export default function({data, formKeys, fields, checkForTruthy}) {
  return fields.map(field => {
    const isValidValue = typeof data[field] !== 'undefined' && data[field] !== null
    const conditionIsMet = formKeys.includes(field)
    if (checkForTruthy) {
      if (conditionIsMet && isValidValue) return field
    } else {
      if (!conditionIsMet || !isValidValue) return field
    }
  })
}
