import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'

export default resolver({
  params: {
    options: {
      type: 'blackbox',
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    },
    environmentId: {
      type: 'ID'
    },
    userId: {
      type: 'ID'
    },
    view: {
      type: String,
      optional: true
    },
    hook: {
      type: 'blackbox'
    },
    hooksData: {
      type: 'blackbox',
      optional: true
    }
  },
  mutation: true,
  private: true,
  async resolve(
    functionType,
    {options: rawOptions, params, environmentId, userId, view, hook, hooksData},
    viewer
  ) {
    const schema = functionType.optionsSchema
    let options
    if (schema) {
      options = await clean(schema, rawOptions)
      await validate(schema, options)
    }
    return await functionType.execute({
      options,
      params,
      environmentId,
      userId,
      view,
      hook,
      hooksData,
      viewer
    })
  }
})
