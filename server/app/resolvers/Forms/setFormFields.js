import {resolver} from '@orion-js/app'
import getCollectionSchema from 'app/helpers/resolvers/forms/getCollectionSchema'
import Collections from 'app/collections/Collections'
import Field from 'app/models/Form/Field'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'
import includes from 'lodash/includes'

export default resolver({
  params: {
    formId: {
      type: 'ID'
    },
    fields: {
      type: [Field],
      custom(value) {
        const fields = []
        for (const field of value) {
          if (includes(fields, field.fieldName)) return 'repeatedFieldName'
          fields.push(field.fieldName)
        }
      }
    }
  },
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({formId, fields}, viewer) {
    const form = await Forms.findOne(formId)
    const collection = await Collections.findOne(form.collectionId)
    const formFields = getCollectionSchema(fields)
    const collectionFields = getCollectionSchema(collection.fields)

    if (form.type === 'create') {
      const missingField = collectionFields.find(element => {
        return (
          !element.optional &&
          !formFields.find(element2 => {
            return element.fieldName === element2.fieldName
          })
        )
      })

      if (missingField) {
        throw new Error(`El campo ${missingField.editableLabel} es obligatorio.`)
      }
    }

    await form.update({$set: {fields}})
    return form
  }
})
