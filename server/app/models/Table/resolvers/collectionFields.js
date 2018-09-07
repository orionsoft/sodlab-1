import {resolver} from '@orion-js/app'
import Field from 'app/models/Field'

export default resolver({
  returns: [Field],
  async resolve(table, params, viewer) {
    const collection = await table.collection()
    return table.fields
      .filter(field => {
        return field.type === 'field'
      })
      .map(field => {
        return collection.fields.find(colField => colField.name === field.fieldName)
      })
  }
})
