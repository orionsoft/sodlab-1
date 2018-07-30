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
    optional: true,
    async custom(formId, {currentDoc}) {
      if (currentDoc.type === 'form' && !formId) {
        return 'required'
      }
    }
  },
  tableId: {
    type: 'ID',
    optional: true,
    async custom(tableId, {currentDoc}) {
      if (currentDoc.type === 'table' && !tableId) {
        return 'required'
      }
    }
  },
  indicatorId: {
    type: 'ID',
    optional: true,
    async custom(indicatorId, {currentDoc}) {
      if (currentDoc.type === 'indicator' && !indicatorId) {
        return 'required'
      }
    }
  },
  fullSize: {
    type: Boolean,
    optional: true
  }
}
