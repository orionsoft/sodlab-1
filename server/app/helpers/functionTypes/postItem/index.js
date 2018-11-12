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
      label: '(opcional) Entorno (default es el actual)',
      optional: true
    },
    timeoutMinutes: {
      type: Number,
      label: '(opcional) Timeout (minutos, default es 1,5 min)',
      optional: true
    }
  },
  async execute({
    options: {collectionId, itemId, url, environmentId, timeoutMinutes},
    params,
    environmentId: actualEnv,
    userId
  }) {
    try {
      const col = await Collections.findOne(collectionId)
      const collection = await col.db()
      const item = await collection.findOne(itemId)
      if (!item) return

      const timeout = timeoutMinutes ? timeoutMinutes * 60000 : 90000

      await rp({
        method: 'POST',
        uri: url,
        body: {
          _id: item._id,
          environmentId: environmentId || actualEnv,
          ...item.data
        },
        json: true,
        timeout: timeout
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
