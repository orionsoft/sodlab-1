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
    defaultValue: {},
    async custom(options, {currentDoc, keys}) {
      if (['field'].includes(currentDoc.type)) return

      try {
        const optionsSchema = optionsSchemas[currentDoc.type] || {}
        await validate(optionsSchema, options)
      } catch (error) {
        if (error.isValidationError) {
          throw error.prependKey(keys.join('.'))
        }
        throw error
      }
    }
  }
}
