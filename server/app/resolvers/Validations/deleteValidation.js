import Validations from 'app/collections/Validations'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    validationId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({validationId}, viewer) {
    await Validations.remove(validationId)
    return true
  }
})
