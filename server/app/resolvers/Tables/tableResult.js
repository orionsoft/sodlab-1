import {createPaginatedResolver} from '@orion-js/app'
import Item from 'app/models/Item'
import Tables from 'app/collections/Tables'

export default createPaginatedResolver({
  returns: Item,
  params: {
    tableId: {
      type: String
    }
  },
  async getCursor({tableId}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    const filter = await table.filter()
    const query = filter ? await filter.createQuery() : {}
    const db = await collection.db()
    return db.find(query)
  }
})
