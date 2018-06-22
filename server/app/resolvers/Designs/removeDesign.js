import {resolver} from '@orion-js/app'
import Designs from 'app/collections/Designs'

export default resolver({
  params: {
    designId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({designId}, viewer) {
    await Designs.remove(designId)
    return true
  }
})
