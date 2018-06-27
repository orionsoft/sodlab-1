import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Tables from 'app/collections/Tables'
import Table from 'app/models/Table'

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
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Table,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, collectionId, title}, viewer) {
    const tableId = await Tables.insert({
      environmentId,
      collectionId,
      title,
      createdAt: new Date()
    })
    return await Tables.findOne(tableId)
  }
})
