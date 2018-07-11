import {paginatedResolver} from '@orion-js/app'
import Item from 'app/models/Item'
import Tables from 'app/collections/Tables'
import Filters from 'app/collections/Filters'

export default paginatedResolver({
  returns: Item,
  params: {
    tableId: {
      type: 'ID'
    },
    filterId: {
      type: 'ID',
      optional: true
    },
    filterOptions: {
      type: 'blackbox',
      optional: true
    }
  },
  async getCursor({tableId, filterId, filterOptions}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    if (!filterId && !table.allowsNoFilter) throw new Error('Filter is required')
    const query = filterId
      ? await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
      : {}
    const db = await collection.db()
    return db.find(query)
  }
})
