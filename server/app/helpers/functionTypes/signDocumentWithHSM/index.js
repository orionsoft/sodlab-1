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
  async execute({options}) {
    const {clientId, signingReason, layout, collectionId, itemId, fileKey, signedFileKey} = options
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) throw new Error('Document not found')
    const file = item.data[fileKey]
    if (!file) throw new Error('Document file not found')
    const fileURL = `https://s3.amazonaws.com/${file.bucket}/${file.key.replace(/ /, '%20')}`

    const fileData = await rp({
      uri: fileURL,
      method: 'GET',
      encoding: null,
      headers: {
        'Content-type': 'applcation/pdf'
      }
    })

    const base64 = Buffer.from(fileData).toString('base64')
    const doc = {
      documentId: itemId,
      data: base64,
      signingReason,
      layout
    }

    const callback = `${process.env.SERVER_URL}/callbacks/cloud-hsm`
    const params = {
      documents: [doc],
      clientId,
      callback: [callback]
    }
    console.log('sending hsm request with callback', {callback})
    const result = await rp({
      method: 'POST',
      uri: 'https://api.firmador.sodlab.cl/sign',
      body: params,
      json: true
    })

    await Requests.insert({
      requestId: result.requestId,
      collectionId,
      itemId,
      signedFileKey,
      createdAt: new Date(),
      status: 'pending'
    })
    console.log(result)
  }
}
