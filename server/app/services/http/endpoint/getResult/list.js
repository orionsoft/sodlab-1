import Filters from 'app/collections/Filters'

export default async function({endpoint, parameters}) {
  const collection = await endpoint.collection()
  if (!collection) return 'Collection not found'

  const query = endpoint.filterId
    ? await (await Filters.findOne(endpoint.filterId)).createQuery({filterOptions: parameters})
    : {}
  const db = await collection.db()
  const items = await db.find(query).toArray()

  return items.map(item => {
    return {
      _id: item._id,
      ...item.data
    }
  })
}
