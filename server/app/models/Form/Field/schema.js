export default {
  fieldName: {
    type: String,
    label: 'Field'
  },
  type: {
    type: String,
    allowedValues: ['fixed', 'parameter', 'editable', 'indicator']
  },
  optional: {
    type: Boolean,
    optional: true
  },
  fixed: {
    type: 'blackbox',
    optional: true
  },
  parameterName: {
    type: String,
    optional: true
  },
  editableLabel: {
    type: String,
    optional: true
  },
  indicatorId: {
    type: String,
    optional: true
  },
  editableDefaultValue: {
    type: String,
    optional: true
  },
  indicatorDefaultValue: {
    type: String,
    optional: true
  }
}
