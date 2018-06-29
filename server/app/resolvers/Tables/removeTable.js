import Tables from 'app/collections/Tables'
import {resolver} from '@orion-js/app'
// import postRemoveTable from 'app/helpers/resolvers/tables/postRemoveTable'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({tableId}, viewer) {
    // await postRemoveTable(tableId)
    await Tables.remove(tableId)
    return true
  }
})
