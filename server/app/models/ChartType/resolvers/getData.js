import {resolver} from '@orion-js/app'
import {clean, validate} from '@orion-js/schema'

export default resolver({
  private: true,
  async resolve(chartType, {options: rawOptions, params, query, collection, chart}, viewer) {
    const schema = chartType.optionsSchema
    let options
    if (schema) {
      options = await clean(schema, rawOptions)
      await validate(schema, options)
    }
    return await chartType.getResult({options, params, query, collection, chart})
  }
})
