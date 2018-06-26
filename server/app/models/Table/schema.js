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
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID',
    optional: true
  },
  fields: {
    label: 'Campos de tabla',
    type: [TableField],
    defaultValue: [],
    optional: true
  }
}
