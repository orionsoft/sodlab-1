import {resolver} from '@orion-js/app'
import Design from 'app/models/Design'
import Designs from 'app/collections/Designs'

export default resolver({
  params: {
    designId: {
      type: 'ID'
    }
  },
  returns: Design,
  async resolve({designId}, viewer) {
    return await Designs.findOne(designId)
  }
})
