import Forms from 'app/collections/Forms'
import {resolver} from '@orion-js/app'
import Form from 'app/models/Form'

export default resolver({
  params: {
    formId: {
      type: 'ID'
    },
    form: {
      type: Form.clone({
        name: 'UpdateForm',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({formId, form: formData}, viewer) {
    const form = await Forms.findOne(formId)
    await form.update({$set: formData})
    return form
  }
})
