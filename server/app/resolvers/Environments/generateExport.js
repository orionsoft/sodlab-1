import {resolver} from '@orion-js/app'
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

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    }
  },
  returns: String,
  mutation: true,
  role: 'admin',
  async resolve({environmentId}, viewer) {
    const result = {
      charts: await Charts.find({environmentId}).toArray(),
      collections: await Collections.find({environmentId}).toArray(),
      filters: await Filters.find({environmentId}).toArray(),
      forms: await Forms.find({environmentId}).toArray(),
      hooks: await Hooks.find({environmentId}).toArray(),
      indicators: await Indicators.find({environmentId}).toArray(),
      links: await Links.find({environmentId}).toArray(),
      roles: await Roles.find({environmentId}).toArray(),
      tables: await Tables.find({environmentId}).toArray(),
      views: await Views.find({environmentId}).toArray()
    }

    return JSON.stringify(result)
  }
})
