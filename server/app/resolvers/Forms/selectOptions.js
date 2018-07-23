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
    },
    typeFromForm: {
      type: String,
      optional: true
    }
  },
  returns: [SelectOption],
  async resolve({environmentId, formId, fieldName, typeFromForm}, viewer) {
    const form = formId ? await Forms.findOne(formId) : await Environments.findOne(environmentId)

    const schema = formId ? await form.schema() : await form.profileSchema()

    const field = typeFromForm || fieldName.replace(formId ? 'data.' : 'profile.', '')
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
