import {resolver} from '@orion-js/app'
import isNil from 'lodash/isNil'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(rule, {filterOptions}, viewer) {
    const operator = await rule.operator()

    const value = rule.type === 'fixed' ? rule.fixed.value : filterOptions[rule.parameterName]
    // if (isNil(value)) return

    const query = await operator.getQuery({value}, viewer)
    const key = rule.fieldName === '_id' ? '_id' : `data.${rule.fieldName}`
    return {[key]: query}
  }
})
