import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(form, params, viewer) {
    return serializeSchema(await form.schema())
  }
})
