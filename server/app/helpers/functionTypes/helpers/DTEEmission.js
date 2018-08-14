import fetch from 'node-fetch'

export default async function emitirDTE(options, url) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(options.body),
    headers: options.headers
  })
  const result = await response.json()
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  return result
}
