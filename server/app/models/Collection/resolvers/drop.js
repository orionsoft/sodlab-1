import {resolver} from '@orion-js/app'

export default resolver({
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(collection, params, viewer) {
    const collectionDB = await collection.db()
    try {
      await collectionDB.rawCollection.drop()
    } catch (e) {
      console.log('Error while drop collection', e)
      return false
    }
    return true
  }
})
