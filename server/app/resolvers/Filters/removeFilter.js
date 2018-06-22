import {resolver} from '@orion-js/app'
import Filters from 'app/collections/Filters'

export default resolver({
  params: {
    filterId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({filterId}, viewer) {
    await Filters.remove(filterId)
    return true
  }
})
