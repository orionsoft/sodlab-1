import {resolver} from '@orion-js/app'
import {validate, clean} from '@orion-js/schema'
import Item from 'app/models/Item'
import Forms from 'app/collections/Forms'

export default resolver({
  params: {
    formId: {
      type: 'ID',
      label: 'Formulario'
    },
    itemId: {
      type: 'ID',
      optional: true,
      label: 'ID del item a actualizar'
    },
    data: {
      type: 'blackbox',
      label: 'Data'
    }
  },
  returns: Item,
  mutation: true,
  async resolve({formId, itemId, data: rawData}, viewer) {
    const form = await Forms.findOne(formId)
    const collection = await form.collectionDb()

    const schema = await form.schema()
    const data = await clean(schema, rawData)
    try {
      await validate(schema, data)
    } catch (error) {
      if (error.isValidationError) {
        throw error.prependKey('data')
      }
      throw error
    }

    if (form.type === 'create') {
      const newItemId = await collection.insert({data})
      return {_id: newItemId, data}
    } else if (form.type === 'update') {
      if (!itemId) {
        throw new Error('Item id is required')
      }
      const item = await collection.findOne(itemId)
      if (!item) {
        throw new Error('Item not found')
      }
      await item.update({$set: {data}})
      return item
    }
  }
})
