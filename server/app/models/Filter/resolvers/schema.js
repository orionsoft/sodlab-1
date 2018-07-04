import {resolver} from '@orion-js/app'
import operators from 'app/helpers/operators'
import fieldTypes from 'app/helpers/fieldTypes'
import isNil from 'lodash/isNil'

export default resolver({
  params: {
    includeParameters: {
      type: Boolean,
      defaultValue: false
    }
  },
  returns: String,
  private: true,
  async resolve(filter, {includeParameters}, viewer) {
    const fields = {}

    for (const condition of filter.conditions) {
      for (const rule of condition.rules) {
        if (rule.type === 'fixed') continue
        if (rule.type === 'parameter' && !includeParameters) continue

        const operator = operators[rule.operatorId]
        const fieldType = fieldTypes[operator.inputType]
        const key = rule.parameterName
        fields[key] = {
          label: rule.editableLabel,
          type: fieldType.rootType,
          fieldType: operator.inputType,
          fieldOptions: rule.operatorInputOptions,
          optional: rule.optional,
          defaultValue: fieldType.defaultValue,
          async custom(value, ...args) {
            if (fieldType.validate) {
              return await fieldType.validate(value, rule.operatorInputOptions, ...args)
            }
          }
        }
      }
    }

    if (Object.keys(fields).length === 0) return null
    return fields
  }
})
