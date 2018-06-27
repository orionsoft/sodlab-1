import {resolver} from '@orion-js/app'
import fieldTypes from 'app/helpers/fieldTypes'

export default resolver({
  private: true,
  async resolve(field) {
    return fieldTypes[field.type]
  }
})
