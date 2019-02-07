import {resolver} from '@orion-js/app'
import {requireTwoFactor} from '@orion-js/auth'
import Item from 'app/models/Item'
import Forms from 'app/collections/Forms'
import Users from 'app/collections/Users'
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

    if (Object.keys(viewer).length !== 0) {
      const user = await Users.findOne({_id: viewer.userId})
      const twoFactor = await user.hasTwoFactor()
      if (!twoFactor && form.requireTwoFactor) {
        throw new Error('Necesitas activar autenticación de dos factores en "Mi Cuenta"')
      }
    }

    if (form.requireTwoFactor) {
      await requireTwoFactor(viewer)
    }

    const item = await getResult({form, itemId, data, viewer}).catch(err => {
      throw err
    })

    await runHooks({form, item, userId: viewer.userId, viewer}).catch(err => {
      throw err || 'No se han podido ejecutar alguna(s) de la funcionalidades adicionales'
    })

    const collection = await form.collectionDb()
    const finalItem = await collection.findOne(item._id)

    return finalItem
  }
})
