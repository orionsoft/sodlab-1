export default {
  fieldName: {
    type: String,
    label: 'Field',
    optional: true,
    async custom(fieldName, {currentDoc}) {
      if (currentDoc.type !== 'section' && !fieldName) {
        return 'required'
      }
    },
    async autoValue(fieldName, {currentDoc}) {
      if (currentDoc.type === 'section') {
        fieldName = 'section_' + currentDoc.editableLabel
        return fieldName
      } else {
        return fieldName
      }
    }
  },
  type: {
    type: String,
    allowedValues: ['fixed', 'parameter', 'editable', 'indicator', 'section']
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
    optional: true,
    async custom(editableLabel, {currentDoc}) {
      console.log({currentDoc})
      if (currentDoc.type === 'section' && !editableLabel) {
        return 'required'
      }
    }
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
