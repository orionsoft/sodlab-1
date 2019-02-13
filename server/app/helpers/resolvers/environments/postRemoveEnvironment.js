import Buttons from 'app/collections/Buttons'
import Charts from 'app/collections/Charts'
import Collections from 'app/collections/Collections'
import Endpoints from 'app/collections/Endpoints'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import Filters from 'app/collections/Filters'
import Forms from 'app/collections/Forms'
import Hooks from 'app/collections/Hooks'
import Indicators from 'app/collections/Indicators'
import Links from 'app/collections/Links'
import Notifications from 'app/collections/Notifications'
import Roles from 'app/collections/Roles'
import Tables from 'app/collections/Tables'
import Views from 'app/collections/Views'
import Validations from 'app/collections/Validations'

export default async function(environmentId) {
  const collections = await Collections.find({environmentId}).toArray()
  await Promise.all(collections.map(collection => collection.drop()))
  await Buttons.remove({environmentId})
  await Charts.remove({environmentId})
  await Collections.remove({environmentId})
  await Endpoints.remove({environmentId})
  await EnvironmentUsers.remove({environmentId})
  await Filters.remove({environmentId})
  await Forms.remove({environmentId})
  await Hooks.remove({environmentId})
  await Indicators.remove({environmentId})
  await Links.remove({environmentId})
  await Notifications.remove({environmentId})
  await Roles.remove({environmentId})
  await Tables.remove({environmentId})
  await Views.remove({environmentId})
  await Validations.remove({environmentId})

  return true
}
