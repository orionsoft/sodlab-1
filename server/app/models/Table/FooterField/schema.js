export default {
  type: {
    type: String,
    allowedValues: ['text', 'indicator']
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
  text: {
    type: String,
    optional: true,
    async custom(text, {currentDoc}) {
      if (currentDoc.type === 'text' && !text) {
        return 'required'
      }
    }
  }
}
