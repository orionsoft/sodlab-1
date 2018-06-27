import {resolver} from '@orion-js/app'
import operators from 'app/helpers/operators'
import Operator from 'app/models/Operator'

export default resolver({
  params: {},
  returns: [Operator],
  async resolve(params, viewer) {
    return Object.keys(operators).map(_id => {
      return {
        _id,
        ...operators[_id]
      }
    })
  }
})
