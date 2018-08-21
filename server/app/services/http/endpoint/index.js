import {route} from '@orion-js/app'
import Endpoints from 'app/collections/Endpoints'
import getParameters from './getParameters'
import getResult from './getResult'
import checkAuth from './checkAuth'

route('/endpoint/:environmentId/:identifier', async function({params, request, headers}) {
  if (request.method !== 'POST') {
    return 'Only post requests are accepted'
  }

  const parameters = getParameters(request)

  const {environmentId, identifier} = params
  const endpoint = await Endpoints.findOne({environmentId, identifier})
  if (!endpoint) return 'Endpoint not found'

  const authError = await checkAuth({endpoint, headers})
  if (authError) {
    return authError
  }

  const result = getResult({endpoint, parameters})

  return result
})
