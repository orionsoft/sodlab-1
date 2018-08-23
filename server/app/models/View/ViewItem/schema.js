import {validate, clean} from '@orion-js/schema'

const viewItemSchema = {
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
    allowedValues: ['form', 'table', 'chart', 'indicator', 'layout', 'button']
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
  buttonId: {
    type: 'ID',
    optional: true,
    async custom(buttonId, {currentDoc}) {
      if (currentDoc.type === 'button' && !buttonId) {
        return 'required'
      }
    }
  },
  fullSize: {
    type: Boolean,
    optional: true
  },
  subItems: {
    type: ['blackbox'],
    optional: true,
    async custom(subItems, {currentDoc}) {
      if (currentDoc.type !== 'layout') return
      for (const item in subItems) {
        try {
          await validate(viewItemSchema, subItems[item])
        } catch (error) {
          return 'missing Option'
        }
      }
    },
    autoValue(subItems, {currentDoc}) {
      if (subItems) {
        return Promise.all(subItems.map(item => clean(viewItemSchema, item)))
      }
    }
  }
}

export default viewItemSchema
