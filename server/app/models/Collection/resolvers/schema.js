import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(collection, params, viewer) {
    const schema = {}

    for (const field of collection.fields) {
      schema[field.name] = await field.schema()
    }

    return schema
  }
})
