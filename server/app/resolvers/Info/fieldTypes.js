import {resolver} from '@orion-js/app'
import FieldType from 'app/models/FieldType'
import fieldTypes from 'app/helpers/fieldTypes'

export default resolver({
  params: {},
  returns: [FieldType],
  async resolve(params, viewer) {
    return Object.keys(fieldTypes).map(_id => {
      return {
        _id,
        ...fieldTypes[_id]
      }
    })
  }
})
