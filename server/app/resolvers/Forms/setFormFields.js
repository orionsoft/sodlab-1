import {resolver} from '@orion-js/app'
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
    await form.update({$set: {fields}})
    return form
  }
})
