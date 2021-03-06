export default {
  fieldName: {
    type: String,
    label: 'Field'
  },
  type: {
    type: String,
    allowedValues: ['fixed', 'parameter', 'editable']
  },
  operatorId: {
    type: String
  },
  optional: {
    type: Boolean,
    optional: true
  },
  operatorInputOptions: {
    type: 'blackbox',
    optional: true
  },
  fixed: {
    type: 'blackbox',
    optional: true,
    defaultValue: {}
  },
  parameterName: {
    type: String,
    optional: true
  },
  editableLabel: {
    type: String,
    optional: true
  }
}
