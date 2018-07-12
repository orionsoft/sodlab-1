import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(form, params, viewer) {
    const schema = await form.schema()
    return serializeSchema(schema)
  }
})
