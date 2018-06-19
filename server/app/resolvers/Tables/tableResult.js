import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Item from 'app/models/Item'
import Collections from 'app/collections/Collections'

export default createPaginatedResolver({
  returns: Item,
  params: {
    filter: {
      type: String,
      optional: true
    },
    collectionId: {
      type: String
    }
  },
  async getCursor({filter, collectionId}, viewer) {
    const collection = await Collections.findOne(collectionId)
    if (!collection) throw new Error('collection not found')

    const query = {}
    if (filter) {
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }

    const db = await collection.db()

    return db.find(query)
  }
})
