import {resolver, Model} from '@orion-js/app'
import Forms from 'app/collections/Forms'
import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'

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
    environmentId: {
      type: 'ID',
      optional: true
    },
    formId: {
      type: 'ID',
      optional: true
    },
    fieldName: {
      type: String
    }
  },
  returns: [SelectOption],
  async resolve({environmentId, formId, fieldName}, viewer) {
    console.log(environmentId, formId, fieldName)
    const form = formId ? await Forms.findOne(formId) : await Environments.findOne(environmentId)
    console.log('form', form)
    const schema = await form.schema()
    console.log('schema', schema)
    const field = fieldName.replace('data.', '')
    console.log('field', field)
    const fieldSchema = schema[field]
    console.log('fieldSchema', fieldSchema)
    if (!fieldSchema) return []
    const options = fieldSchema.fieldOptions
    console.log('options', options)
    if (!options) return []
    const {collectionId, valueKey, labelKey} = options
    if (!collectionId || !valueKey || !labelKey) return []

    const collection = await Collections.findOne(collectionId)
    console.log('collection', collection)
    const db = await collection.db()
    const fields = {
      _id: 1,
      [`data.${valueKey}`]: 1,
      [`data.${labelKey}`]: 1
    }
    const items = await db.find({}, {fields}).toArray()
    console.log('items', items)
    return items.map(item => {
      return {
        value: valueKey === '_id' ? item._id : item.data[valueKey],
        label: labelKey === '_id' ? item._id : item.data[labelKey]
      }
    })
  }
})
