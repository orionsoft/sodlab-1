import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(form, params, viewer) {
    const collection = await form.collection()
    const schema = {}

    for (const field of form.fields || []) {
      const collectionField = await collection.field({name: field.fieldName})
      if (!collectionField) continue
      schema[field.fieldName] = await field.schema({collectionField})
    }

    return schema
  }
})
