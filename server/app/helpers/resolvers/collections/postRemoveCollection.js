import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Collections from 'app/collections/Collections'

export default async function(collectionId) {
  const collection = await Collections.findOne(collectionId)
  await collection.drop()
  await Forms.remove({collectionId})
  await Tables.remove({collectionId})
  return true
}
