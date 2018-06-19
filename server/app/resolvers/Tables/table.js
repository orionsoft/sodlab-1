import {resolver} from '@orion-js/app'
import Table from 'app/models/Table'
import Tables from 'app/collections/Tables'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    }
  },
  returns: Table,
  async resolve({tableId}, viewer) {
    return await Tables.findOne(tableId)
  }
})
