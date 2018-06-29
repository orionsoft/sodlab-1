import {resolver} from '@orion-js/app'
import Item from 'app/models/Item'

export default resolver({
  params: {
    itemId: {
      type: 'ID',
      optional: true
    }
  },
  returns: Item,
  async resolve(form, {itemId}, viewer) {
    if (!itemId) return
    if (form.type !== 'update') return
    const collectionDb = await form.collectionDb()
    return await collectionDb.findOne(itemId)
  }
})
