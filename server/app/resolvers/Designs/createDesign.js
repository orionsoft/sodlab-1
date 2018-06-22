import {resolver} from '@orion-js/app'
import Design from 'app/models/Design'
import Designs from 'app/collections/Designs'
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
  returns: Design,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const designId = await Designs.insert({
      environmentId,
      name,
      createdAt: new Date()
    })
    return await Designs.findOne(designId)
  }
})
