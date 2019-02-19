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
        omitFields: ['_id', 'environmentId', 'createdAt', 'collectionId']
      })
    }
  },
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({formId, form: formData}, viewer) {
    if (!formData.type) throw new Error('Tipo requerido')
    if (
      formData.type === 'update' &&
      (!formData.updateVariableName || formData.updateVariableName === '')
    ) {
      throw new Error('Nombre de variable requerido')
    }

    const buttons = ['submitButtonText', 'resetButtonText']
    buttons.map(button => {
      if (!formData.hasOwnProperty(button)) {
        formData[button] = null
      }
    })

    if (!formData.onSuccessViewPath) {
      formData['onSuccessViewPath'] = null
    }

    if (!formData.hasOwnProperty('title')) {
      formData['title'] = null
    }

    const form = await Forms.findOne(formId)
    await form.update({$set: formData})
    return form
  }
})
