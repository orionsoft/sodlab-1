import LinkField from './LinkField'
export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  title: {
    type: String,
    label: 'Titulo'
  },
  fields: {
    label: 'Links',
    type: [LinkField],
    defaultValue: [],
    optional: true
  },
  createdAt: {
    type: Date
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  }
}
