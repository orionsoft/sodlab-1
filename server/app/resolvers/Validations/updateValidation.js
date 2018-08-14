import {resolver} from '@orion-js/app'
import Validations from 'app/collections/Validations'
import Validation from 'app/models/Validation'

export default resolver({
  params: {
    validationId: {
      type: 'ID'
    },
    validation: {
      type: Validation.clone({
        name: 'UpdateValidation',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Validation,
  role: 'admin',
  mutation: true,
  async resolve({validationId, validation: validationData}, viewer) {
    const validation = await Validations.findOne(validationId)
    await validation.update({$set: validationData})
    return validation
  }
})
