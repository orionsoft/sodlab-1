import {resolver, UserError} from '@orion-js/app'
import validationsV2 from 'app/helpers/misc/validationsV2'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    },
    formId: {
      type: 'ID',
      optional: true
    },
    data: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(validation, {params, formId, data}, viewer) {
    const validationType = await validation.validationType()
    let options = {}
    if (validationsV2.includes(validationType._id)) {
      options = await validation.getOptionsV2({params: data}, viewer)
      try {
        return await validationType.executeValidation({options, formId, data})
      } catch (error) {
        throw new UserError('validation', error.message)
      }
    } else {
      options = await validation.getOptions({params})
      try {
        return await validationType.executeValidation({options}, viewer)
      } catch (error) {
        throw new UserError('validation', error.message)
      }
    }
  }
})
