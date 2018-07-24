import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  params: {
    includeParameters: {
      type: Boolean,
      optional: true
    }
  },
  returns: 'blackbox',
  async resolve(filter, {includeParameters}, viewer) {
    const schema = await filter.schema({includeParameters})
    if (!schema) return null
    return serializeSchema(schema)
  }
})
