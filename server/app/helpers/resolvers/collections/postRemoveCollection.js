import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Collections from 'app/collections/Collections'
import Charts from 'app/collections/Charts'
import Hooks from 'app/collections/Hooks'
import Filters from 'app/collections/Filters'

export default async function(collectionId) {
  const collection = await Collections.findOne(collectionId)
  await collection.drop()
  await Charts.remove({collectionId})
  await Filters.remove({collectionId})
  await Forms.remove({collectionId})
  await Hooks.remove({collectionId})
  await Tables.remove({collectionId})
  return true
}
