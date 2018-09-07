import Collections from 'app/collections/Collections'
import rp from 'request-promise'

export default {
  name: 'Enviar archivo Api Integraciones',
  optionsSchema: {
    collection: {
      type: String,
      label: 'Colección del archivo',
      fieldType: 'collectionSelect'
    },
    url: {
      type: String,
      label: 'URL'
    }
  },
  async execute({options, params}) {
    const collection = await Collections.findOne(options.collection)
    const collectionDB = await collection.db()
    const {_id, data} = await collectionDB.findOne(params._id)
    if (!data) return

    await rp({
      method: 'POST',
      uri: options.url,
      body: {
        _id,
        data
      },
      json: true
    })
  }
}
