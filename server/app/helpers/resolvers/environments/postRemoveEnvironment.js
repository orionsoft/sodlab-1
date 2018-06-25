import Collections from 'app/collections/Collections'
import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Links from 'app/collections/Links'
import Roles from 'app/collections/Roles'

export default async function(environmentId) {
  let collections = await Collections.find({environmentId}).toArray()
  await collections.map(async collection => {
    const collectionDB = await collection.db()
    await collectionDB.rawCollection
      .drop()
      .then(quote => {
        console.log(quote)
      })
      .catch(error => {
        console.error('Collection not found', error)
      })
  })
  await Collections.remove({environmentId})
  await Forms.remove({environmentId})
  await Tables.remove({environmentId})
  await Links.remove({environmentId})
  await Roles.remove({environmentId})
  return true
}
