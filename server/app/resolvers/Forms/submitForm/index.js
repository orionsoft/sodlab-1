import {resolver} from '@orion-js/app'
import Item from 'app/models/Item'
import Forms from 'app/collections/Forms'
import prependKey from 'app/helpers/misc/prependKey'
import validate from './validate'
import fieldsData from './fieldsData'

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
    },
    currentUser: {
      type: 'blackbox',
      label: 'Usuario Actual'
    }
  },
  returns: Item,
  mutation: true,
  async resolve({formId, itemId, data: rawData, currentUser}, viewer) {
    const form = await Forms.findOne(formId)
    const collection = await form.collectionDb()
    const newRawData = await fieldsData(form, rawData, currentUser)
    const data = await validate({form, rawData: newRawData})

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
      const $set = prependKey(data, 'data')
      await item.update({$set})
      return await collection.findOne(itemId)
    }
  }
})
