import isEmpty from 'lodash/isEmpty'
import TableField from './TableField'
import Tables from 'app/collections/Tables'

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
    label: 'Nombre',
    description: 'Solo puede haber una tabla con este nombre',
    async custom(name, {doc}) {
      if (doc.tableId) {
        const table = await Tables.findOne(doc.tableId)
        const result = await Tables.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: table.environmentId
        })
        if (result && table._id !== result._id) return 'notUnique'
      }
    }
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
  filterByDefault: {
    type: String,
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
  fields: {
    label: 'Campos de tabla',
    type: [TableField],
    defaultValue: [],
    optional: true
  },
  orderFiltersByName: {
    type: Boolean,
    optional: true
  },
  footer: {
    label: 'Footer',
    type: ['blackbox'],
    defaultValue: [],
    optional: true
  },
  exportable: {
    label: 'Exportable',
    type: Boolean,
    optional: true
  },
  exportWithId: {
    label: 'Exportar con id',
    type: Boolean,
    optional: true
  },
  defaultLimit: {
    type: Number,
    optional: true,
    label: 'Altura mínima',
    defaultValue: 10
  }
}
