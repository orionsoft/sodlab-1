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
  requiredField: {
    type: String,
    optional: true,
    async custom(requiredField, {currentDoc}) {
      if (currentDoc.requiredType === 'editable' && !requiredField) {
        return 'required'
      }
    }
  },
  requiredValue: {
    type: String,
    optional: true,
    async custom(requiredValue, {currentDoc}) {
      if (currentDoc.requiredType === 'editable' && !requiredValue) {
        return 'required'
      }
    }
  },
  requiredParameter: {
    type: String,
    optional: true,
    async custom(requiredParameter, {currentDoc}) {
      if (currentDoc.requiredType === 'parameter' && !requiredParameter) {
        return 'required'
      }
    }
  },
  requiredType: {
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
  },
  sizeSmall: {
    type: String,
    defaultValue: '12',
    async custom(sizeSmall, {currentDoc}) {
      if (currentDoc.type === 'editable' && !sizeSmall) {
        return 'required'
      }
    }
  },
  sizeMedium: {
    type: String,
    defaultValue: '12',
    async custom(sizeMedium, {currentDoc}) {
      if (currentDoc.type === 'editable' && !sizeMedium) {
        return 'required'
      }
    }
  },
  sizeLarge: {
    type: String,
    defaultValue: '12',
    async custom(sizeLarge, {currentDoc}) {
      if (currentDoc.type === 'editable' && !sizeLarge) {
        return 'required'
      }
    }
  }
}
