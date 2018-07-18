import {resolver} from '@orion-js/app'
import Indicator from 'app/models/Indicator'
import Indicators from 'app/collections/Indicators'
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
    collectionId: {
      type: 'ID'
    },
    name: {
      type: String,
      label: 'Nombre'
    },
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Indicator,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, collectionId, name, title}, viewer) {
    const indicatorId = await Indicators.insert({
      environmentId,
      collectionId,
      name,
      title,
      createdAt: new Date()
    })
    return await Indicators.findOne(indicatorId)
  }
})
