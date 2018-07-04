import {resolver, serializeSchema} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  async resolve(filter, params, viewer) {
    const schema = await filter.schema({includeParameters: false})
    if (!schema) return null
    return serializeSchema(schema)
  }
})
