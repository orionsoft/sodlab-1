import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import Filters from 'app/collections/Filters'
import getFooterData from 'app/helpers/resolvers/tables/getFooterData'
import exportToFile from 'app/helpers/resolvers/tables/exportToFile'

export default resolver({
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
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  mutation: true,
  async resolve({tableId, filterId, filterOptions, params}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    if (!filterId && !table.allowsNoFilter) throw new Error('Filter is required')
    const query = filterId
      ? await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
      : {}
    const db = await collection.db()
    const items = await db.find(query).toArray()
    const footerItems = await getFooterData(table.footer, params, filterId, filterOptions, viewer)
    const file = await exportToFile(items, footerItems, table)
    return await file
  }
})
