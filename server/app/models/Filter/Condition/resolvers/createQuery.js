import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(condition, params, viewer) {
    const promises = condition.rules.map(async rule => {
      return await rule.createQuery()
    })
    const rules = await Promise.all(promises)
    return {$and: rules.filter(rule => !!rule)}
  }
})
