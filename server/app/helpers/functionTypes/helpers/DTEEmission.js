import fetch from 'node-fetch'

export default async function emitirDTE(options) {
  var url = 'https://lioren.cl/api/bhe'

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  const call = await fetch(url, {
    method: 'POST', // or 'PUT'
    body: options.data, // data can be `string` or {object}!
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
    })
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  return await call
}
