import {resolver} from '@orion-js/app'
import Validations from 'app/collections/Validations'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    },
    userId: {
      type: 'ID'
    },
    view: {
      type: String,
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(hook, {params, userId, view}, viewer) {
    const {environmentId, name} = hook
    for (const validationId of hook.validationsIds || []) {
      const validation = await Validations.findOne(validationId)
      try {
        await validation.execute({params})
      } catch (error) {
        console.log('Hook validation did not pass', error)
        return
      }
    }
    const functionType = await hook.functionType()
    const options = await hook.getOptions({params})
    return await functionType.executeFunction({
      options,
      params,
      environmentId,
      userId,
      functionName: name,
      view
    })
  }
})
