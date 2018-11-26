import {resolver} from '@orion-js/app'
import buttonRunHooks from './buttonRunHooks'
import tableResult from 'app/resolvers/Tables/tableResult'

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
    const getItems = await tableResult(params)
    const arrayItems = await getItems.cursor.toArray()
    console.log('array items', arrayItems.length)
    const itemsObject = items[0]
    const broughtItems = Object.keys(itemsObject)
      .map(key => {
        const value = itemsObject[key]
        return {key, value}
      })
      .filter(item => item.value)
      .map(item => item.key)

    const obtainedItems = await arrayItems.filter(item => broughtItems.includes(item._id))
    console.log('obtained items', obtainedItems.length)
    if (!obtainedItems.length) return
    for (let parameters of obtainedItems) {
      parameters = {_id: parameters._id, ...parameters.data}
      await buttonRunHooks({buttonId, parameters}, viewer)
    }
  }
})
