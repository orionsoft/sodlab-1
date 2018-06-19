import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Views from 'app/collections/Views'
import View from 'app/models/View'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    path: {
      type: String,
      label: 'Ruta',
      async custom(path, {doc}) {
        const view = await Views.findOne({path, environmentId: doc.environmentId})
        if (view) return 'notUnique'
      }
    }
  },
  returns: View,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, path}, viewer) {
    const viewId = await Views.insert({
      path,
      environmentId,
      name: path,
      createdAt: new Date()
    })
    return await Views.findOne(viewId)
  }
})
