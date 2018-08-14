import {resolver} from '@orion-js/app'
import Validations from 'app/collections/Validations'
import Validation from 'app/models/Validation'
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
      label: 'Name'
    }
  },
  returns: Validation,
  mutation: true,
  role: 'admin',
  async resolve({name, environmentId}, viewer) {
    const item = {
      environmentId,
      name,
      createdAt: new Date()
    }
    item._id = await Validations.insert(item)
    return item
  }
})
