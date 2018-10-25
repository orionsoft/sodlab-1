import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import Hooks from 'app/collections/Hooks'
import Users from 'app/collections/Users'
import {requireTwoFactor} from '@orion-js/auth'

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
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({tableId, fieldIndex, itemId}, viewer) {
    const table = await Tables.findOne(tableId)
    const collection = await table.collection()
    if (!collection) throw new Error('Collection not found')

    const field = table.fields[fieldIndex]
    if (field.type !== 'deleteRowByUser') throw new Error('Table column is not delete')

    const {
      services: {twoFactor}
    } = await Users.findOne({_id: viewer.session.userId})

    console.log('Two factor:', twoFactor)
    if (!twoFactor && field.options.requireTwoFactor)
      throw new Error('Necesitas activar 2FA en la configuración')

    if (field.options.requireTwoFactor) {
      await requireTwoFactor(viewer)
    }

    const collectionDB = await collection.db()

    let item
    if (field.options && field.options.hooksIds && field.options.hooksIds.length) {
      item = await collectionDB.findOne(itemId)
      if (!item) {
        throw new Error('Item not found')
      }
    }

    await collectionDB.remove(itemId)

    if (field.options && field.options.hooksIds && field.options.hooksIds.length) {
      const hooks = await Hooks.find({_id: {$in: field.options.hooksIds}}).toArray()
      const params = {_id: item._id, ...item.data}
      for (const hook of hooks) {
        try {
          await hook.execute({params})
        } catch (e) {
          console.log('Error running hook', e)
        }
      }
    }
    return true
  }
})
