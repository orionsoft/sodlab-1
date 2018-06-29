import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    name: {
      type: String,
      label: 'Nombre'
    },
    collectionId: {
      type: String,
      label: 'Collección'
    }
  },
  returns: Filter,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name, collectionId}, viewer) {
    const filterId = await Filters.insert({
      environmentId,
      name,
      collectionId,
      createdAt: new Date()
    })
    console.log(filterId, 'hello world')
    return await Filters.findOne(filterId)
  }
})
