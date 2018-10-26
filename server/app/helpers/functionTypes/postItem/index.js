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
    },
    environmentId: {
      type: String,
      label: 'Entorno'
    }
  },
  async execute({options: {collectionId, itemId, url, environmentId}}) {
    try {
      const col = await Collections.findOne(collectionId)
      const collection = await col.db()
      const item = await collection.findOne(itemId)
      if (!item) return

      await rp({
        method: 'POST',
        uri: url,
        body: {
          _id: item._id,
          environmentId,
          ...item.data
        },
        json: true
      })
      return {success: true}
    } catch (err) {
      console.log(
        `Error executing the postItem hook with itemId ${itemId}, collecctionId ${collectionId} and envId ${environmentId}`,
        err
      )
      return {success: false}
    }
  }
}
