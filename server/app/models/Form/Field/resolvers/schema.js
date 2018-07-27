import {resolver} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'

export default resolver({
  private: true,
  async resolve(formField, {collectionField}, viewer) {
    const schema = {
      ...(await collectionField.schema()),
      formFieldType: formField.type
    }

    schema.optional = formField.optional

    if (formField.type === 'fixed' && formField.fixed) {
      schema.autoValue = () => formField.fixed.value
    }

    if (formField.type === 'indicator' && formField.indicatorId) {
      schema.autoValue = async () => {
        const indicator = await Indicators.findOne(formField.indicatorId)
        const value = await indicator.result({}, viewer)
        return value
      }
    }

    if (formField.type === 'editable') {
      schema.label = formField.editableLabel
    }

    if (formField.type === 'parameter') {
      schema.parameterName = formField.parameterName
    }

    return schema
  }
})
