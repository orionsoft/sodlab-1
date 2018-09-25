import {resolver} from '@orion-js/app'
import Validations from 'app/collections/Validations'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(hook, {params}, viewer) {
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
    return await functionType.executeFunction({options, params})
  }
})
