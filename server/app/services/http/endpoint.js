import {route} from '@orion-js/app'
import Endpoints from 'app/collections/Endpoints'
import Filters from 'app/collections/Filters'
import {json} from 'micro'

route('/endpoint/:environmentId/:identifier', async function({params, request}) {
  if (request.method !== 'POST') {
    return 'Only post requests are accepted'
  }
  const options = await json(request)

  const {environmentId, identifier} = params
  const endpoint = await Endpoints.findOne({environmentId, identifier})
  if (!endpoint) return 'Endpoint not found'
  const collection = await endpoint.collection()
  if (!collection) return 'Collection not found'

  if (endpoint.password && options.password !== endpoint.password) {
    return 'Password is incorrect'
  }

  const query = endpoint.filterId
    ? await (await Filters.findOne(endpoint.filterId)).createQuery({filterOptions: options})
    : {}
  const db = await collection.db()
  const items = await db.find(query).toArray()

  return items.map(item => {
    return {
      _id: item._id,
      ...item.data
    }
  })
})
