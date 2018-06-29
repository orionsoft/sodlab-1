import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(rule, params, viewer) {
    const operator = await rule.operator()
    // el unico que sirve por ahora es type fixed
    const value = rule.fixed.value
    const query = await operator.getQuery({value})
    return {[`data.${rule.fieldName}`]: query}
  }
})
