import {route} from '@orion-js/app'
import HsmDocuments from 'app/collections/HsmDocuments'

route('/hsm/get-documents', async function({getBody, headers}) {
  if (!headers.authorization) return 'Missing auth token'
  const token = headers.authorization.replace('Bearer ', '')
  if (process.env.HSM_DOC_FINDER_TOKEN !== token) return 'Invalid authorization token'

  const body = await getBody()

  if (!body) return 'invalid request'

  const parsedBody = JSON.parse(body)
  if (parsedBody.itemId) {
    if (typeof parsedBody.itemId !== 'string') {
      return 'Invalid itemId value'
    }
  } else {
    return 'Missing itemId in request body'
  }
  const {itemId} = parsedBody

  try {
    const hsmDocuments = await HsmDocuments.find({itemId}).toArray()

    if (!hsmDocuments.length) {
      return `No documents found for the itemId provided`
    }

    const requestsIds = hsmDocuments.map(async doc => {
      const hsmRequest = await doc.getRequestData({requestId: doc.requestId})
      return {...doc, ...hsmRequest}
    })

    const res = await Promise.all(requestsIds)

    return {res}
  } catch (err) {
    console.log(`An error ocurred when searching the DB`, err)
    return `An error ocurred when searching the DB`
  }
})
