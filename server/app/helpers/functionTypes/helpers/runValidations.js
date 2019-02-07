import Validations from 'app/collections/Validations'

export async function runValidations({hook, params, viewer}) {
  for (const validationId of hook.validationsIds || []) {
    const validation = await Validations.findOne(validationId)
    try {
      await validation.execute({params, data: params}, viewer)
    } catch (error) {
      throw {customMsg: `Hook validation ${validation.name}, ` + error, originalMsg: error}
    }
  }
  return true
}
