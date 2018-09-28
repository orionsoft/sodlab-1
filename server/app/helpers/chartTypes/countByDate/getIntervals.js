import getFirstAndLast from './getFirstAndLast'
import moment from 'moment'

export default async function({collection, query, dateKey, divideBy}) {
  const {firstDate, lastDate} = await getFirstAndLast({collection, query, dateKey, divideBy})
  const intervals = []

  const cursor = moment(firstDate).startOf(divideBy)
  while (cursor.isBefore(lastDate)) {
    console.log({cursor})
    const fromDate = cursor.toDate()
    console.log({fromDate})
    cursor.add(1, divideBy)
    console.log({cursor, divideBy})
    const toDate = cursor.toDate()
    intervals.push({fromDate, toDate})
  }

  return intervals
}
