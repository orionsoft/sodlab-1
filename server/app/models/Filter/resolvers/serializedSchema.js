import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(filter, params, viewer) {
    const schema = await filter.schema({includeParameters: false})
    if (!schema) return null
    return serializeSchema(schema)
  }
})
