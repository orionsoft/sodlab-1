import {resolver} from '@orion-js/app'
import Field from 'app/models/Field'

export default resolver({
  params: {
    name: {
      type: String
    }
  },
  returns: Field,
  async resolve(collection, {name}, viewer) {
    return collection.fields.find(collectionField => collectionField.name === name)
  }
})
