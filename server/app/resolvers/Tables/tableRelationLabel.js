import {resolver} from '@orion-js/app'
import Tables from 'app/collections/Tables'
import Collections from 'app/collections/Collections'

export default resolver({
  params: {
    tableId: {
      type: 'ID'
    },
    fieldName: {
      type: String
    },
    value: {
      type: String
    }
  },
  returns: String,
  cache: 3000,
  async resolve({tableId, fieldName, value}, viewer) {
    const table = await Tables.findOne(tableId)
    if (!table) return
    for (const tableField of table.fields) {
      if (tableField.fieldName !== fieldName) continue
      const tableCollection = await Collections.findOne(table.collectionId)
      if (!tableCollection) return
      const schema = await tableCollection.schema()
      const fieldSchema = schema[fieldName]
      if (!fieldSchema) return
      const options = fieldSchema.fieldOptions
      if (!options) return
      const {collectionId, valueKey, labelKey} = options
      if (!collectionId || !valueKey || !labelKey) return
      const collection = await Collections.findOne(collectionId)
      const db = await collection.db()
      const searchBy = valueKey === '_id' ? '_id' : `data.${valueKey}`
      const item = await db.findOne({[searchBy]: value})
      if (!item) return
      return labelKey === '_id' ? item._id : item.data[labelKey]
    }
  }
})
