import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'

export default resolver({
  params: {
    options: {
      type: 'blackbox',
      optional: true
    },
    itemId: {
      type: 'ID',
      optional: true
    }
  },
  mutation: true,
  private: true,
  async resolve(validationType, {options: rawOptions, itemId}, viewer) {
    const schema = validationType.optionsSchema
    let options
    if (schema) {
      options = await clean(schema, rawOptions)
      await validate(schema, options)
    }
    return await validationType.execute({options, itemId})
  }
})
