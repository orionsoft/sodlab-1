export default {
  _id: {
    type: 'ID',
    custom(id) {
      if (!/^[a-z0-9-_]+$/g.test(id)) return 'invalid'
    }
  },
  name: {
    type: String
  },
  createdAt: {
    type: Date
  }
}
