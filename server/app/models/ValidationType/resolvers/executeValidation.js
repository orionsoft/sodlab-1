import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'

export default resolver({
  params: {
    options: {
      type: 'blackbox',
      optional: true
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
  mutation: true,
  private: true,
  async resolve(validationType, {options: rawOptions, formId, data}, viewer) {
    const schema = validationType.optionsSchema
    let options
    if (schema) {
      options = await clean(schema, rawOptions)
      await validate(schema, options)
    }
    return await validationType.execute({
      options,
      params: rawOptions,
      formId,
      data,
      userId: viewer.userId
    })
  }
})
