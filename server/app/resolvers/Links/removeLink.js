import Links from 'app/collections/Links'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    linkId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({linkId}, viewer) {
    await Links.remove(linkId)
    return true
  }
})
