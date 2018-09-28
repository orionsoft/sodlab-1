export default async function({collection, query, dateKey}) {
  const first = await collection.findOne(query, {sort: {[dateKey]: 1}})
  const last = await collection.findOne(query, {sort: {[dateKey]: -1}})

  if (!first && !last) {
    return {firstDate: new Date(), lastDate: new Date()}
  }

  if (!first && last) {
    return {firstDate: last.data[dateKey], lastDate: last.data[dateKey]}
  }

  if (first && !last) {
    return {firstDate: first.data[dateKey], lastDate: first.data[dateKey]}
  }

  return {firstDate: first.data[dateKey], lastDate: last.data[dateKey]}
}
