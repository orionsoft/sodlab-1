import {resolver} from '@orion-js/app'
import ValidationType from 'app/models/ValidationType'
import validationTypes from 'app/helpers/validationTypes'

export default resolver({
  returns: ValidationType,
  async resolve(hook, params, viewer) {
    return {
      _id: hook.validationTypeId,
      ...validationTypes[hook.validationTypeId]
    }
  }
})
