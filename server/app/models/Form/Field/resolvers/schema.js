import {resolver} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'

export default resolver({
  private: true,
  async resolve(formField, {collectionField}, viewer) {
    const schema = {
      ...(await collectionField.schema()),
      formFieldType: formField.type,
      sizeSmall: formField.sizeSmall,
      sizeMedium: formField.sizeMedium,
      sizeLarge: formField.sizeLarge,
      requiredType: formField.requiredType,
      requiredField: formField.requiredField,
      requiredValue: formField.requiredValue,
      requiredParameter: formField.requiredParameter,
      showField: formField.showField
    }

    schema.optional = formField.optional

    if (formField.type === 'fixed' && formField.fixed) {
      schema.autoValue = () => formField.fixed.value
    }

    if (formField.type === 'indicator' && formField.indicatorId) {
      schema.autoValue = async (val, {doc}) => {
        const indicator = await Indicators.findOne(formField.indicatorId)
        const params = {...doc}
        const value =
          (await indicator.result({filterOptions: params, params}, viewer)) ||
          formField.indicatorDefaultValue
        return value
      }
    }

    if (formField.type === 'editable') {
      schema.label = formField.editableLabel
      schema.defaultValue = formField.editableDefaultValue
    }

    if (formField.type === 'parameter') {
      schema.parameterName = formField.parameterName
    }

    return schema
  }
})
