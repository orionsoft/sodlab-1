import getFirstAndLast from './getFirstAndLast'

export default async function({collection, query, numberKey, divideBy}) {
  const {firstValue, lastValue} = await getFirstAndLast({collection, query, numberKey, divideBy})
  const intervals = []

  let cursor = firstValue
  while (cursor < lastValue) {
    const fromValue = Math.floor(cursor / divideBy) * divideBy
    cursor = cursor + divideBy
    intervals.push({fromValue, toValue: cursor})
  }

  return intervals
}
