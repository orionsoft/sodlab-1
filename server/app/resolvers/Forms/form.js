import {resolver} from '@orion-js/app'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'

export default resolver({
  params: {
    formId: {
      type: 'ID'
    }
  },
  returns: Form,
  async resolve({formId}, viewer) {
    return await Forms.findOne(formId)
  }
})
