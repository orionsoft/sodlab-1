import {resolver} from '@orion-js/app'
import validationTypes from 'app/helpers/validationTypes'
import ValidationType from 'app/models/ValidationType'

export default resolver({
  params: {},
  returns: [ValidationType],
  async resolve(params, viewer) {
    return Object.keys(validationTypes).map(_id => {
      return {
        _id,
        ...validationTypes[_id]
      }
    })
  }
})
