import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Links from 'app/collections/Links'
import Link from 'app/models/Link'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Link,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, title}, viewer) {
    const linkId = await Links.insert({
      environmentId,
      title,
      createdAt: new Date()
    })
    return await Links.findOne(linkId)
  }
})
