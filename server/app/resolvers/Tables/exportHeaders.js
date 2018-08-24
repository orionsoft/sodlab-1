import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import exportHeaders from 'app/helpers/resolvers/tables/exportHeaders'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    }
  },
  returns: 'blackbox',
  mutation: true,
  async resolve({tableId}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) throw new Error('collection not found')
    const collection = await table.collection()
    if (!collection) throw new Error('collection not found')
    const file = await exportHeaders(collection.fields)
    return await file
  }
})
