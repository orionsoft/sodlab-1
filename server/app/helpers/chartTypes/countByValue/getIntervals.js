import getFirstAndLast from './getFirstAndLast'

export default async function({collection, query, numberKey, divideBy}) {
  const {firstValue, lastValue} = await getFirstAndLast({collection, query, numberKey, divideBy})
  console.log({firstValue, lastValue})
  const intervals = []

  let cursor = firstValue
  while (cursor < lastValue) {
    console.log({cursor})
    const fromValue = Math.floor(cursor / divideBy) * divideBy
    cursor = cursor + divideBy
    console.log({cursor})
    intervals.push({fromValue, toValue: cursor})
  }

  return intervals
}
