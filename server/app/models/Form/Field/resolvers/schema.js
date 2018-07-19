import {resolver} from '@orion-js/app'

export default resolver({
  private: true,
  async resolve(formField, {collectionField}, viewer) {
    const schema = {
      ...(await collectionField.schema()),
      formFieldType: formField.type
    }

    schema.optional = formField.optional

    if (formField.type === 'fixed' && formField.fixed) {
      schema.defaultValue = formField.fixed.value
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