import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(condition, params, viewer) {
    const promises = condition.rules.map(async rule => {
      return await rule.createQuery(params, viewer)
    })
    const rules = await Promise.all(promises)
    const filteredRules = rules.filter(rule => !!rule)
    if (!filteredRules.length) return
    return {$and: filteredRules}
  }
})
