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
    }
  },
  returns: Filter,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const filterId = Filters.insert({
      environmentId,
      name,
      createdAt: new Date()
    })
    return await Filters.findOne(filterId)
  }
})
