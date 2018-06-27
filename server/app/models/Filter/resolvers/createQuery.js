import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(filter, params, viewer) {
    const promises = filter.conditions.map(async condition => {
      return await condition.createQuery()
    })
    const conditions = await Promise.all(promises)
    return {$or: conditions}
  }
})
