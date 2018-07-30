import {resolver} from '@orion-js/app'
import Collection from 'app/models/Collection'
import Collections from 'app/collections/Collections'
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
    _id: {
      type: 'ID',
      label: 'Namespace',
      description: 'Un nombre único, solo minusculas y números',
      custom(id) {
        if (!/^[a-z0-9]+$/g.test(id)) return 'invalid'
      }
    },
    name: {
      type: String,
      label: 'Nombre',
      description: 'Solo puede haber una colección con este nombre',
      async custom(name) {
        const result = await Collections.findOne({name: {$regex: `^${name}$`, $options: 'i'}})
        if (result) return 'notUnique'
      }
    }
  },
  returns: Collection,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, _id, name}, viewer) {
    const collectionId = await Collections.insert({
      _id: `${environmentId}_${_id}`,
      name,
      environmentId,
      createdAt: new Date()
    })
    return await Collections.findOne(collectionId)
  }
})
