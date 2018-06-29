import {createPaginatedResolver} from '@orion-js/app'
import Item from 'app/models/Item'
import Tables from 'app/collections/Tables'
import Filters from 'app/collections/Filters'

export default createPaginatedResolver({
  returns: Item,
  params: {
    tableId: {
      type: 'ID'
    },
    filterId: {
      type: 'ID',
      optional: true
    }
  },
  async getCursor({tableId, filterId}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    if (!filterId && !table.allowsNoFilter) throw new Error('Filter is required')
    const query = filterId ? await (await Filters.findOne(filterId)).createQuery() : {}
    const db = await collection.db()
    return db.find(query)
  }
})
