import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'

export default resolver({
  params: {
    item: {
      type: 'blackbox'
    }
  },
  returns: ['blackbox'],
  async resolve(collection, {item}, viewer) {
    const values = await Promise.all(
      collection.fields.map(async field => {
        if (!field.options || !field.options.collectionId) return
        const {collectionId, valueKey, labelKey} = field.options
        const col = await Collections.findOne(collectionId)
        const db = await col.db()
        const fieldName = field.name
        const fieldValue = item.data[fieldName]
        if (!fieldValue) return
        const newItem = await db.findOne(fieldValue)
        const result = labelKey === '_id' ? newItem._id : newItem.data[labelKey]

        return {
          fieldName,
          result
        }
      })
    )
    const filteredValues = values.filter(
      value => typeof value !== 'undefined' && typeof value !== 'null'
    )
    return filteredValues
  }
})
