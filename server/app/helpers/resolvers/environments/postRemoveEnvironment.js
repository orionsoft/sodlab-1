import Collections from 'app/collections/Collections'
import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
import Links from 'app/collections/Links'
import Roles from 'app/collections/Roles'

export default async function(environmentId) {
  await Collections.remove({environmentId: environmentId})
  await Forms.remove({environmentId: environmentId})
  await Tables.remove({environmentId: environmentId})
  await Links.remove({environmentId: environmentId})
  await Roles.remove({environmentId: environmentId})
  return true
}
