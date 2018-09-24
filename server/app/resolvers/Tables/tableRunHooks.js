import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import Hooks from 'app/collections/Hooks'
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
    if (field.type !== 'runHooks') throw new Error('Table column is not run hooks')

    if (field.options.requireTwoFactor) {
      await requireTwoFactor(viewer)
    }

    if (!(field.options && field.options.hooksIds && field.options.hooksIds.length)) {
      throw new Error('No hooks')
    }

    const collectionDB = await collection.db()
    const item = await collectionDB.findOne(itemId)
    if (!item) {
      throw new Error('Item not found')
    }

    const hooks = await Hooks.find({_id: {$in: field.options.hooksIds}}).toArray()
    const params = {_id: item._id, ...item.data}
    for (const hook of hooks) {
      try {
        await hook.execute({params, userId: viewer.userId})
      } catch (e) {
        console.log('Error running hook', e)
      }
    }

    return true
  }
})
