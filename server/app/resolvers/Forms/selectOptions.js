import {resolver, Model} from '@orion-js/app'
import Forms from 'app/collections/Forms'
import Collections from 'app/collections/Collections'

const SelectOption = new Model({
  name: 'SelectOption',
  schema: {
    label: {
      type: String
    },
    value: {
      type: String
    }
  }
})

export default resolver({
  params: {
    formId: {
      type: 'ID'
    },
    fieldName: {
      type: String
    }
  },
  returns: [SelectOption],
  async resolve({formId, fieldName}, viewer) {
    const form = await Forms.findOne(formId)
    if (!form) return []
    const schema = await form.schema()
    const field = fieldName.replace('data.', '')
    const fieldSchema = schema[field]
    if (!fieldSchema) return []
    const options = fieldSchema.fieldOptions
    if (!options) return []
    const {collectionId, valueKey, labelKey} = options
    if (!collectionId || !valueKey || !labelKey) return []

    const collection = await Collections.findOne(collectionId)
    const db = await collection.db()
    const fields = {
      _id: 1,
      [`data.${valueKey}`]: 1,
      [`data.${labelKey}`]: 1
    }
    const items = await db.find({}, {fields}).toArray()

    return items.map(item => {
      return {
        value: valueKey === '_id' ? item._id : item.data[valueKey],
        label: labelKey === '_id' ? item._id : item.data[labelKey]
      }
    })
  }
})
