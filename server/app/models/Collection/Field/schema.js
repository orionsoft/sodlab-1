import fieldTypes from 'app/helpers/fieldTypes'
import {validate, clean} from '@orion-js/schema'

export default {
  name: {
    type: 'ID',
    label: 'ID',
    description: 'El id único del field en el collection, no cambiar nunca'
  },
  label: {
    type: String,
    label: 'El título del campo'
  },
  type: {
    type: String,
    allowedValues: Object.keys(fieldTypes),
    label: 'Tipo'
  },
  options: {
    type: 'blackbox',
    optional: true,
    async custom(options, {currentDoc, keys}) {
      if (!currentDoc.type) return
      try {
        const fieldType = fieldTypes[currentDoc.type]
        await validate(fieldType.optionsSchema, options)
      } catch (error) {
        if (error.isValidationError) {
          throw error.prependKey(keys.join('.'))
        }
        throw error
      }
    },
    autoValue(options, {currentDoc}) {
      if (!currentDoc.type) return {}
      const fieldType = fieldTypes[currentDoc.type]
      return clean(fieldType.optionsSchema, options)
    }
  }
}
