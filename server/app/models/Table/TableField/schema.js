import {validate} from '@orion-js/schema'
import optionsSchemas from './optionsSchemas'

export default {
  type: {
    type: String,
    allowedValues: ['field', 'selectIconButton', 'routeIconButton']
  },
  fieldName: {
    type: String,
    optional: true,
    async custom(fieldName, {currentDoc}) {
      if (currentDoc.type === 'field' && !fieldName) {
        return 'required'
      }
    }
  },
  label: {
    type: String
  },
  options: {
    type: 'blackbox',
    optional: true,
    async custom(options, {currentDoc, keys}) {
      if (['field'].includes(currentDoc.type)) return

      try {
        const optionsSchema = optionsSchemas[currentDoc.type] || {}
        const optionsToValidate = options || {}
        await validate(optionsSchema, optionsToValidate)
      } catch (error) {
        if (error.isValidationError) {
          throw error.prependKey(keys.join('.'))
        }
        throw error
      }
    }
  }
}
