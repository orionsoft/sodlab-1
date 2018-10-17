import {resolver} from '@orion-js/app'
import buttonRunHooks from './buttonRunHooks'
import tableResult from 'app/resolvers/Tables/tableResult'
import Tables from 'app/collections/Tables'

export default resolver({
  params: {
    buttonId: {
      type: 'ID',
      optional: true
    },
    parameters: {
      type: ['blackbox'],
      optional: true
    },
    all: {
      type: Boolean,
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({buttonId, parameters: items, all, params}, viewer) {
    let obtainedItems = []
    if (all) {
      const getItems = await tableResult(params)
      obtainedItems = await getItems.cursor.toArray()
      if (!obtainedItems.length) return
      for (const parameters of obtainedItems) {
        await buttonRunHooks({buttonId, parameters}, viewer)
      }
    } else {
      const getItems = await tableResult(params)
      const arrayItems = await getItems.cursor.toArray()
      const itemsObject = items[0]
      const broughtItems = Object.keys(itemsObject)
        .map(key => {
          const value = itemsObject[key]
          return {key, value}
        })
        .filter(item => item.value)
        .map(item => item.key)

      obtainedItems = await arrayItems.filter(item => broughtItems.includes(item._id))
      if (!obtainedItems.length) return
      for (const parameters of obtainedItems) {
        await buttonRunHooks({buttonId, parameters}, viewer)
      }
    }
  }
})
