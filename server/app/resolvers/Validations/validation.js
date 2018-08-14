import {resolver} from '@orion-js/app'
import Validation from 'app/models/Validation'
import Validations from 'app/collections/Validations'

export default resolver({
  params: {
    validationId: {
      type: 'ID'
    }
  },
  returns: Validation,
  role: 'admin',
  async resolve({validationId}, viewer) {
    return await Validations.findOne(validationId)
  }
})
