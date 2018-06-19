import {resolver} from '@orion-js/app'
import Link from 'app/models/Link'
import Links from 'app/collections/Links'

export default resolver({
  params: {
    linkId: {
      type: 'ID'
    }
  },
  returns: Link,
  async resolve({linkId}, viewer) {
    return await Links.findOne(linkId)
  }
})
