import Forms from 'app/collections/Forms'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    formId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({formId}, viewer) {
    await Forms.remove(formId)
    return true
  }
})
