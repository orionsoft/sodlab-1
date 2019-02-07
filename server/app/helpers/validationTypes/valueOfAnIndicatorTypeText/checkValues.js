export default function({regex, value, checkForTruthy}) {
  const conditionIsMet = regex.test(value)
  if (checkForTruthy) {
    if (conditionIsMet) return false
  } else {
    if (!conditionIsMet) return false
  }
  return true
}
