import {resolver} from '@orion-js/app'
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
  async resolve({formId, itemId, data}, viewer) {
    const form = await Forms.findOne(formId)
    const collection = await form.collectionDb()

    if (form.type === 'create') {
      const newItemId = await collection.insert({data})
      return {_id: newItemId, data}
    } else if (form.type === 'update') {
      const item = await collection.findOne(itemId)
      return item.update({$set: {data}})
    }
  }
})
