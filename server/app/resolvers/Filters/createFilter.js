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
      label: 'Nombre',
      description: 'Solo puede haber un filtro con este nombre',
      async custom(name, {doc}) {
        const filter = await Filters.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: doc.environmentId
        })
        if (filter) return 'notUnique'
      }
    },
    title: {
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
  async resolve({environmentId, name, title, collectionId}, viewer) {
    const filterId = await Filters.insert({
      environmentId,
      name,
      title,
      collectionId,
      createdAt: new Date()
    })
    return await Filters.findOne(filterId)
  }
})
