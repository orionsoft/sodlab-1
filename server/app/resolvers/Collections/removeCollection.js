import Collections from 'app/collections/Collections'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({collectionId}, viewer) {
    await Collections.remove(collectionId)
    return true
  }
})
