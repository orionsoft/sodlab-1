import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Collections from 'app/collections/Collections'

export default async function(collectionId) {
  const collection = await Collections.findOne(collectionId)
  const collectionDB = await collection.db()
  await collectionDB.rawCollection.drop((err, ok) => {
    if (err) return false
    return true
  })
  await Forms.remove({collectionId})
  await Tables.remove({collectionId})
  return true
}
