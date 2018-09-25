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
  chartTypeId: {
    type: 'ID',
    optional: true
  },
  collectionId: {
    type: 'ID',
    optional: true
  },
  filtersIds: {
    type: [String],
    optional: true,
    async custom(filtersIds, {currentDoc}) {
      if (isEmpty(filtersIds) && !currentDoc.allowsNoFilter) {
        return 'needFilter'
      }
    }
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
  options: {
    type: 'blackbox',
    optional: true
  },
  filterByDefault: {
    type: String,
    optional: true
  }
}
