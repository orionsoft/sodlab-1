import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(environment, params, viewer) {
    const schema = {}

    for (const field of environment.profileSchema) {
      schema[field.name] = await field.schema()
    }

    return schema
  }
})
