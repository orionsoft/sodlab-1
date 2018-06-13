import {resolver} from '@orion-js/app'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'
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
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const formId = await Forms.insert({
      name,
      environmentId,
      createdAt: new Date()
    })
    return await Forms.findOne(formId)
  }
})
