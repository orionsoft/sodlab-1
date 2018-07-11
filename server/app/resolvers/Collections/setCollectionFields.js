import {resolver} from '@orion-js/app'
import Field from 'app/models/Field'
import Collections from 'app/collections/Collections'
import Collection from 'app/models/Collection'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    },
    fields: {
      type: [Field]
    }
  },
  returns: Collection,
  mutation: true,
  role: 'admin',
  async resolve({collectionId, fields}, viewer) {
    const collection = await Collections.findOne(collectionId)
    await collection.update({$set: {fields}})
    return collection
  }
})
