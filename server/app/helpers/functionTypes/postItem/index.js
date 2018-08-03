import Collections from 'app/collections/Collections'
import rp from 'request-promise'

export default {
  name: 'Enviar datos de un item',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: 'Id del item'
    },
    url: {
      type: String,
      label: 'URL'
    }
  },
  async execute({collectionId, itemId, url}) {
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) return

    await rp({
      method: 'POST',
      uri: url,
      body: {
        _id: item._id,
        ...item.data
      },
      json: true
    })
  }
}
