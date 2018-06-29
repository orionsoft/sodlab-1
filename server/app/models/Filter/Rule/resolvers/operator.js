import {resolver} from '@orion-js/app'
import Operator from 'app/models/Operator'
import operators from 'app/helpers/operators'

export default resolver({
  returns: Operator,
  async resolve(rule, params, viewer) {
    return {
      _id: rule.operatorId,
      ...operators[rule.operatorId]
    }
  }
})
