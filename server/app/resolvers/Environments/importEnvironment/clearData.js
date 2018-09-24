import Charts from 'app/collections/Charts'
import Collections from 'app/collections/Collections'
import Filters from 'app/collections/Filters'
import Forms from 'app/collections/Forms'
import Hooks from 'app/collections/Hooks'
import Indicators from 'app/collections/Indicators'
import Links from 'app/collections/Links'
import Roles from 'app/collections/Roles'
import Tables from 'app/collections/Tables'
import Views from 'app/collections/Views'
import Endpoints from 'app/collections/Endpoints'
import Buttons from 'app/collections/Buttons'
import Validations from 'app/collections/Validations'

export default async function(environment) {
  const environmentId = environment._id
  await Buttons.remove({environmentId})
  await Charts.remove({environmentId})
  await Collections.remove({environmentId})
  await Endpoints.remove({environmentId})
  await Filters.remove({environmentId})
  await Forms.remove({environmentId})
  await Hooks.remove({environmentId})
  await Indicators.remove({environmentId})
  await Links.remove({environmentId})
  await Roles.remove({environmentId})
  await Tables.remove({environmentId})
  await Validations.remove({environmentId})
  await Views.remove({environmentId})
}
