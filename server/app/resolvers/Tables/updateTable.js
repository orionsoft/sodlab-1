import Tables from 'app/collections/Tables'
import {resolver} from '@orion-js/app'
import Table from 'app/models/Table'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    },
    table: {
      type: Table.clone({
        name: 'UpdateTable',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Table,
  mutation: true,
  role: 'admin',
  async resolve({tableId, table: tableData}, viewer) {
    const table = await Tables.findOne(tableId)
    await table.update({$set: tableData})
    return table
  }
})
