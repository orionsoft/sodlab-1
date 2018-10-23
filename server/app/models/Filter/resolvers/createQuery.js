import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'
import isEmpty from 'lodash/isEmpty'

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

    let cleaned = filterOptions
    if (schema) {
      cleaned = await clean(schema, filterOptions || {})
      await validate(schema, cleaned)
    }

    const promises = filter.conditions.map(async condition => {
      if (isEmpty(filterOptions)) {
        const filterRule = condition.rules.filter(({type}) => type !== 'editable')

        condition.rules = filterRule
        return await condition.createQuery({filterOptions: cleaned}, viewer)
      } else {
        return await condition.createQuery({filterOptions: cleaned}, viewer)
      }
    })

    const conditions = await Promise.all(promises)
    const filteredConditions = conditions.filter(con => !!con)
    if (!filteredConditions.length) return {}
    return {$or: filteredConditions}
  }
})
