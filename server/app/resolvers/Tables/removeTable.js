import Tables from 'app/collections/Tables'
import {resolver} from '@orion-js/app'

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
    await Tables.remove(tableId)
    return true
  }
})
