export default {
  _id: {
    type: 'ID'
  },
  userId: {
    type: String
  },
  environmentId: {
    type: 'ID'
  },
  email: {
    type: String
  },
  profile: {
    type: 'blackbox',
    optional: true
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  }
}
