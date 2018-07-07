import {resolver, Collection} from '@orion-js/app'
import Item from 'app/models/Item'

const cache = {}

export default resolver({
  private: true,
  async resolve(collection, params, viewer) {
    if (cache[collection._id]) return cache[collection._id]

    cache[collection._id] = new Collection({
      name: collection._id,
      model: Item,
      indexes: [],
      hooks: await collection.hooks()
    })

    return cache[collection._id]
  }
})
