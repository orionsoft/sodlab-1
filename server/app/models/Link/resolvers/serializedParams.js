import {resolver, serializeSchema} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  async resolve(form, params, viewer) {
    return serializeSchema(await form.schema())
  }
})
