import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import Hooks from 'app/collections/Hooks'
import Users from 'app/collections/Users'
import {requireTwoFactor} from '@orion-js/auth'
import {runSequentialHooks} from 'app/helpers/functionTypes/helpers'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    },
    fieldIndex: {
      type: Number
    },
    itemId: {
      type: 'ID'
    },
    view: {
      type: String,
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({tableId, fieldIndex, itemId, view}, viewer) {
    const table = await Tables.findOne(tableId)
    const collection = await table.collection()
    if (!collection) throw new Error('Collection not found')

    const field = table.fields[fieldIndex]
    if (field.type !== 'runHooks') throw new Error('Table column is not run hooks')

    const {userId} = viewer
    const user = await Users.findOne({_id: userId})
    const twoFactor = await user.hasTwoFactor()

    if (!twoFactor && field.options.requireTwoFactor) {
      throw new Error('Necesitas activar autenticación de dos factores en "Mi Cuenta"')
    }

    if (field.options.requireTwoFactor) {
      await requireTwoFactor(viewer)
    }

    if (!(field.options && field.options.hooksIds && field.options.hooksIds.length)) {
      throw new Error('No se han registrado hooks para este botón')
    }

    const collectionDB = await collection.db()
    const item = await collectionDB.findOne(itemId)
    if (!item) {
      throw new Error('Item not found')
    }

    const hooks = await Hooks.find({_id: {$in: field.options.hooksIds}}).toArray()
    const hooksIds = hooks.map(hook => hook._id)
    const params = {_id: item._id, ...item.data}

    await runSequentialHooks({
      hooksIds,
      params,
      userId,
      shouldStopHooksOnError: field.options.shouldStopHooksOnError,
      environmentId: table.environmentId
    }).catch(err => {
      console.log('table throwing hook error')
      const error = {
        ...err,
        tableName: table.name,
        itemIdToRunHooks: itemId
      }
      console.log(error)
      throw err.originalMsg ||
        'No se han podido ejecutar alguna(s) de la funcionalidades adicionales'
    })

    return true
  }
})
