import {resolver} from '@orion-js/app'
import functionTypes from 'app/helpers/functionTypes'
import FunctionType from 'app/models/FunctionType'

export default resolver({
  params: {},
  returns: [FunctionType],
  async resolve(params, viewer) {
    return Object.keys(functionTypes).map(_id => {
      return {
        _id,
        ...functionTypes[_id]
      }
    })
  }
})
