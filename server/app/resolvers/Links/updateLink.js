import Links from 'app/collections/Links'
import {resolver} from '@orion-js/app'
import Link from 'app/models/Link'

export default resolver({
  params: {
    linkId: {
      type: 'ID'
    },
    link: {
      type: Link.clone({
        name: 'UpdateLink',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Link,
  mutation: true,
  role: 'admin',
  async resolve({linkId, link: linkData}, viewer) {
    const link = await Links.findOne(linkId)
    await link.update({$set: linkData})
    return link
  }
})
