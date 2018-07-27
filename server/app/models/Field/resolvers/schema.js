import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(field, params, viewer) {
    const fieldType = await field.fieldType()
    console.log('fieldType', {
      type: fieldType.rootType,
      label: field.label,
      fieldType: field.type,
      fieldOptions: field.options,
      optional: field.optional,
      defaultValue: fieldType.defaultValue,
      async custom(value, ...args) {
        if (fieldType.validate) {
          return await fieldType.validate(value, field.options, ...args)
        }
      }
    })
    return {
      type: fieldType.rootType,
      label: field.label,
      fieldType: field.type,
      fieldOptions: field.options,
      optional: field.optional,
      defaultValue: fieldType.defaultValue,
      async custom(value, ...args) {
        if (fieldType.validate) {
          return await fieldType.validate(value, field.options, ...args)
        }
      }
    }
  }
})
