import numeral from 'numeral'

export default function({
  validationType,
  value: rawValue,
  valueToCheck: rawValueToCheck,
  checkForTruthy
}) {
  let failReason = ''
  let conditionIsMet
  const value = numeral(rawValue).value()
  const valueToCheck = numeral(rawValueToCheck).value()
  switch (validationType) {
    case 'biggerOrEqualThan': {
      conditionIsMet = value >= valueToCheck
      failReason = checkForTruthy
        ? `no debe ser mayor o igual ${valueToCheck}`
        : `debe ser mayor o igual a ${valueToCheck}`
      break
    }
    case 'biggerThan': {
      conditionIsMet = value > valueToCheck
      failReason = checkForTruthy
        ? `no deben ser mayor a ${valueToCheck}`
        : `debe ser mayor a ${valueToCheck}`
      break
    }
    case 'equalTo': {
      conditionIsMet = value === valueToCheck
      failReason = checkForTruthy
        ? `no debe ser igual a ${valueToCheck}`
        : `debe ser igual a ${valueToCheck}`
      break
    }
    case 'notEqualTo': {
      conditionIsMet = value !== valueToCheck
      failReason = checkForTruthy
        ? `no debe ser distinto a ${valueToCheck}`
        : `debe ser distinto a ${valueToCheck}`
      break
    }
    case 'smallerThan': {
      conditionIsMet = value < valueToCheck
      failReason = checkForTruthy
        ? `no debe ser menor a ${valueToCheck}`
        : `debe ser menor a ${valueToCheck}`
      break
    }
    case 'smallerOrEqualThan': {
      conditionIsMet = value <= valueToCheck
      failReason = checkForTruthy
        ? `no debe ser menor o igual a ${valueToCheck}`
        : `debe ser menor o igual a ${valueToCheck}`
      break
    }
    default:
      break
  }

  if (checkForTruthy) {
    if (conditionIsMet) return {passValidation: false, failReason}
  } else {
    if (!conditionIsMet) return {passValidation: false, failReason}
  }

  return {passValidation: true}
}
