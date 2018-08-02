import {resolver} from '@orion-js/app'
import FunctionType from 'app/models/FunctionType'
import functionTypes from 'app/helpers/functionTypes'

export default resolver({
  returns: FunctionType,
  async resolve(hook, params, viewer) {
    return {
      _id: hook.functionTypeId,
      ...functionTypes[hook.functionTypeId]
    }
  }
})
