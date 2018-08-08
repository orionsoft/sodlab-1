import fetch from 'node-fetch'

export default async function emitirDTE(options, url) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  const call = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(options.body),
    headers: options.headers
  })
    .then(res => {
      return res.json()
    })
    .catch(error => {
      console.log('Error: ', error)
    })
    .then(response => {
      console.log('Success: ', response)
      return response
    })
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  return await call
}
