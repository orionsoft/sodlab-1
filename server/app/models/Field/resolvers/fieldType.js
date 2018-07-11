import {resolver} from '@orion-js/app'
import fieldTypes from 'app/helpers/fieldTypes'
import FieldType from 'app/models/FieldType'

export default resolver({
  returns: FieldType,
  async resolve(field) {
    return {
      _id: field.type,
      ...fieldTypes[field.type]
    }
  }
})
