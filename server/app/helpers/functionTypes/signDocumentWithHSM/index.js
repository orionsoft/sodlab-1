import Collections from 'app/collections/Collections'
import rp from 'request-promise'
import './callback'
import Requests from './Requests'

export default {
  name: 'Firmar documento con hsm',
  optionsSchema: {
    clientId: {
      label: 'Client id',
      type: String
    },
    signingReason: {
      label: 'Signing reason',
      type: String
    },
    layout: {
      label: 'Layout',
      type: String
    },
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    userId: {
      label: 'Id del usuario',
      type: String
    },
    itemId: {
      type: String,
      label: 'Id del item'
    },
    fileKey: {
      type: String,
      label: 'Campo donde esta el archivo',
      fieldType: 'collectionFieldSelect'
    },
    signedFileKey: {
      type: String,
      label: 'Campo donde se dejará el documento firmado',
      fieldType: 'collectionFieldSelect'
    }
  },
  async execute({options, params, environmentId}) {
    const {
      clientId,
      signingReason,
      layout,
      collectionId,
      itemId,
      fileKey,
      signedFileKey,
      userId
    } = options
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)

    if (!item) {
      console.log('Document not found')
      return {success: false, msg: 'Document not found'}
    }

    const file = item.data[fileKey]

    if (!file) {
      console.log('Document file not found')
      return {success: false, msg: 'Document file not found'}
    }

    let fileURL

    if (typeof file === 'string' && /^https?:.*/.test(file)) {
      fileURL = file
    } else if (typeof file === 'object') {
      fileURL = `https://s3.amazonaws.com/${file.bucket}/${file.key.replace(/ /, '%20')}`
    }

    let fileData

    try {
      fileData = await rp({
        uri: fileURL,
        method: 'GET',
        encoding: null,
        headers: {
          'Content-type': 'applcation/pdf'
        }
      })
    } catch (err) {
      console.log('Error downloading file to send to the HSM')
      return {success: false, msg: 'Error downloading file to send to the HSM'}
    }

    const base64 = Buffer.from(fileData).toString('base64')
    const doc = {
      documentId: itemId,
      data: base64,
      signingReason,
      layout
    }

    const callback = `${process.env.SERVER_URL}/callbacks/cloud-hsm`
    const body = {
      documents: [doc],
      clientId,
      userId,
      callbacks: [callback]
    }

    let result

    try {
      console.log('sending hsm request with callback', {callback})
      result = await rp({
        method: 'POST',
        uri: 'https://api.signer.sodlab.cl/sign',
        body: body,
        json: true
      })
    } catch (err) {
      console.log('Error sending PDF to the HSM')
      return {success: false, msg: 'Error sending PDF to the HSM'}
    }

    try {
      await Requests.insert({
        requestId: result.requestId,
        collectionId,
        itemId,
        signedFileKey,
        createdAt: new Date(),
        status: 'pending'
      })
    } catch (err) {
      console.log(
        'An error ocurred while saving to the HSM collection the following requestId',
        result.requestId
      )
      return {success: false}
    }

    console.log(result)
    return {success: true}
  }
}
