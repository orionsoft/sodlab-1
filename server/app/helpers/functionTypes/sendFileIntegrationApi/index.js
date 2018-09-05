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
    file: {
      type: String,
      label: 'Campo del archivo',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collection'
    },
    url: {
      type: String,
      label: 'URL'
    }
  },
  async execute({options, params}) {
    const collection = await Collections.findOne(options.collection)
    const collectionDB = await collection.db()
    const {data} = await collectionDB.findOne(params._id)
    if (!data) return

    await rp({
      method: 'POST',
      uri: options.url,
      body: data[options.file],
      json: true
    })
  }
}
