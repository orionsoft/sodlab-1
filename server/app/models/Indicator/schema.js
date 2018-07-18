import isEmpty from 'lodash/isEmpty'

export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  title: {
    type: String,
    label: 'Título'
  },
  environmentId: {
    type: 'ID'
  },
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID'
  },
  allowsNoFilter: {
    type: Boolean,
    defaultValue: true,
    async custom(allowsNoFilter, {currentDoc}) {
      if (!allowsNoFilter && isEmpty(currentDoc.filtersIds)) {
        return 'needFilter'
      }
    }
  },
  filtersIds: {
    type: [String],
    optional: true,
    async custom(filtersIds, {currentDoc}) {
      if (isEmpty(filtersIds) && !currentDoc.allowsNoFilter) {
        return 'needFilter'
      }
    }
  }
}
