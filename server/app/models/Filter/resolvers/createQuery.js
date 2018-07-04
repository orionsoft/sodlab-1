import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'

export default resolver({
  params: {
    filterOptions: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(filter, {filterOptions}, viewer) {
    const schema = await filter.schema({includeParameters: true})

    const cleaned = await clean(schema, filterOptions || {})
    await validate(schema, cleaned)

    const promises = filter.conditions.map(async condition => {
      return await condition.createQuery({filterOptions: cleaned}, viewer)
    })

    const conditions = await Promise.all(promises)
    const filteredConditions = conditions.filter(con => !!con)
    if (!filteredConditions.length) return {}
    return {$or: filteredConditions}
  }
})
