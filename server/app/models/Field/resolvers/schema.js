import {resolver} from '@orion-js/app'
import isNil from 'lodash/isNil'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(field, params, viewer) {
    const fieldType = await field.fieldType()
    return {
      type: fieldType.rootType,
      label: field.label,
      fieldType: field.type,
      fieldOptions: field.options,
      optional: true,
      defaultValue: fieldType.defaultValue,
      async custom(value, ...args) {
        // hay que hacer la validación de si es optional
        if (isNil(value)) {
          return 'required'
        }

        if (fieldType.validate) {
          return await fieldType.validate(value, field.options, ...args)
        }
      }
    }
  }
})
