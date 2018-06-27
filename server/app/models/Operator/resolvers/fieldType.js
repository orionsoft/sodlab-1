import {resolver} from '@orion-js/app'
import fieldTypes from 'app/helpers/fieldTypes'
import FieldType from 'app/models/FieldType'

export default resolver({
  returns: FieldType,
  async resolve(operator) {
    return {
      _id: operator.inputType,
      ...fieldTypes[operator.inputType]
    }
  }
})
