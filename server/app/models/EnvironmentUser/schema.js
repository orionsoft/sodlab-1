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
  profile: {
    type: 'blackbox',
    optional: true
  }
}
