export default {
  sizeSmall: {
    type: String
  },
  sizeMedium: {
    type: String
  },
  sizeLarge: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ['form', 'table', 'chart', 'indicator']
  },
  formId: {
    type: 'ID',
    optional: true
  }
}
