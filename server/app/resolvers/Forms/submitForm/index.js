import {resolver} from '@orion-js/app'
import Item from 'app/models/Item'
import Forms from 'app/collections/Forms'
import runHooks from './runHooks'
import getResult from './getResult'

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
    const item = await getResult({form, itemId, data})
    await runHooks({form, item})
    return item
  }
})
