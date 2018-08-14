import {resolver, UserError} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(validation, {params}, viewer) {
    const validationType = await validation.validationType()
    const options = await validation.getOptions({params})
    try {
      return await validationType.executeValidation({options})
    } catch (error) {
      throw new UserError('validation', error.message)
    }
  }
})
