import get from 'lodash/get'

export default async function({collection, query, dateKey}) {
  const first = await collection.findOne(query, {sort: {[dateKey]: 1}})
  const last = await collection.findOne(query, {sort: {[dateKey]: -1}})

  const dateFirst = get(first, dateKey)
  const dateLast = get(last, dateKey)

  if (!first && !last) {
    return {firstDate: new Date(), lastDate: new Date()}
  }

  if (!first && last) {
    return {firstDate: dateLast, lastDate: dateLast}
  }

  if (first && !last) {
    return {firstDate: dateFirst, lastDate: dateFirst}
  }

  return {firstDate: dateFirst, lastDate: dateLast}
}
