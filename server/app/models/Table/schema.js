import isEmpty from 'lodash/isEmpty'
import TableField from './TableField'

export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  title: {
    type: String,
    label: 'Título'
  },
  name: {
    type: String,
    label: 'Nombre'
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
  },
  fields: {
    label: 'Campos de tabla',
    type: [TableField],
    defaultValue: [],
    optional: true
  }
}
