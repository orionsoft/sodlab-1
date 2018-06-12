import {BatchHttpLink} from 'apollo-link-batch-http'
import baseURL from '../url'
import fetch from 'unfetch'
import JSSHA from 'jssha'

const getAuthHeaders = function(body) {
  const userId = localStorage.getItem('session.userId')
  const publicKey = localStorage.getItem('session.publicKey')
  const secretKey = localStorage.getItem('session.secretKey')
  if (!userId || !publicKey || !secretKey) return {}

  const nonce = new Date().getTime()
  const shaObj = new JSSHA('SHA-512', 'TEXT')
  shaObj.setHMACKey(secretKey, 'TEXT')
  shaObj.update(nonce + body)
  const signature = shaObj.getHMAC('HEX')

  return {
    'X-ORION-NONCE': nonce,
    'X-ORION-PUBLICKEY': publicKey,
    'X-ORION-SIGNATURE': signature
  }
}

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
