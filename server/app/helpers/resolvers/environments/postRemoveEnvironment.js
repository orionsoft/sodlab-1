import Collections from 'app/collections/Collections'
import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Links from 'app/collections/Links'
import Roles from 'app/collections/Roles'
import Filters from 'app/collections/Filters'
import Charts from 'app/collections/Charts'
import Hooks from 'app/collections/Hooks'
import Views from 'app/collections/Views'

export default async function(environmentId) {
  const collections = await Collections.find({environmentId}).toArray()
  await Promise.all(collections.map(collection => collection.drop()))
  await Collections.remove({environmentId})
  await Forms.remove({environmentId})
  await Tables.remove({environmentId})
  await Links.remove({environmentId})
  await Roles.remove({environmentId})
  await Filters.remove({environmentId})
  await Charts.remove({environmentId})
  await Hooks.remove({environmentId})
  await Views.remove({environmentId})
  return true
}
