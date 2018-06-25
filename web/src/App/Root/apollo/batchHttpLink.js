import {BatchHttpLink} from 'apollo-link-batch-http'
import baseURL from '../url'
import fetch from 'unfetch'
import getAuthHeaders from 'App/helpers/auth/getAuthHeaders'

const customFetch = (uri, options) => {
  const authHeaders = getAuthHeaders(options.body)
  for (const key of Object.keys(authHeaders)) {
    options.headers[key] = authHeaders[key]
  }
  return fetch(uri, options)
}

export default new BatchHttpLink({
  uri: baseURL + '/graphql',
  fetch: customFetch
})
