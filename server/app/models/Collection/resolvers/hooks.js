import {resolver, hook} from '@orion-js/app'
import collectionDataChanged from 'app/subscriptions/Environments/collectionDataChanged'

export default resolver({
  private: true,
  async resolve(collection, params, viewer) {
    const types = ['after.insert', 'after.update', 'after.remove']
    return types.map(type => {
      return hook(type, function() {
        collectionDataChanged(
          {
            collectionId: collection._id,
            environmentId: collection.environmentId
          },
          type.replace('after.', '')
        )
      })
    })
  }
})
