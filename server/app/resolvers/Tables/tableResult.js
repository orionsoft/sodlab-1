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
    },
    sortBy: {
      type: String,
      optional: true
    },
    sortType: {
      type: String,
      optional: true
    }
  },
  async getCursor({tableId, filterId, filterOptions, page, sortBy, sortType}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    if (!filterId && !table.allowsNoFilter) throw new Error('Filter is required')

    const query = filterId
      ? await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
      : {}
    const db = await collection.db()
    return db
      .find(query)
      .sort(
        sortBy && sortBy !== 'data'
          ? {[`data.${sortBy}`]: sortType === 'DESC' ? 1 : -1}
          : {createdAt: table.orderByAsc ? 1 : -1}
      )
  }
})
