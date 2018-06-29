export default {
  type: {
    type: String,
    allowedValues: ['field', 'selectIconButton', 'routeIconButton']
  },
  fieldName: {
    type: String,
    optional: true
  },
  label: {
    type: String
  },
  options: {
    type: 'blackbox',
    optional: true
  }
}
