import Field from './Field'

export default {
  _id: {
    type: 'ID',
    max: 24,
    custom(id) {
      if (!/^[a-z0-9-_]+$/g.test(id)) return 'invalid'
    }
  },
  environmentId: {
    type: 'ID'
  },
  name: {
    type: String
  },
  createdAt: {
    type: Date
  },
  fields: {
    type: [Field],
    optional: true
  }
}
