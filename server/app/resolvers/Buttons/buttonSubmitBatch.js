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
      const broughtItems = items.filter(item => item).map(item => {
        return Object.keys(item)[0]
      })
      obtainedItems = await arrayItems.filter(item => broughtItems.includes(item._id))
      if (!obtainedItems.length) return
      for (const parameters of obtainedItems) {
        await buttonRunHooks({buttonId, parameters}, viewer)
      }
    }
  }
})
