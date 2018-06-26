import {resolver, serializeSchema} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  async resolve(fieldType, params, viewer) {
    return serializeSchema(fieldType.optionsSchema)
  }
})
