export default async function({collection, query, numberKey}) {
  const first = await collection.findOne(query, {sort: {[`data.${numberKey}`]: 1}})
  const last = await collection.findOne(query, {sort: {[`data.${numberKey}`]: -1}})

  if (!first && !last) {
    return {firstValue: 0, lastValue: 0}
  }

  if (!first && last) {
    return {firstValue: last.data[numberKey], lastValue: last.data[numberKey]}
  }

  if (first && !last) {
    return {firstValue: first.data[numberKey], lastValue: first.data[numberKey]}
  }

  return {firstValue: first.data[numberKey], lastValue: last.data[numberKey]}
}
