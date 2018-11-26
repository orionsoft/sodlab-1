export default {
  _id: {
    type: 'ID'
  },
  requestId: {
    type: String
  },
  itemId: {
    type: 'ID'
  },
  collectionId: {
    type: 'ID'
  },
  signedFileKey: {
    type: String
  },
  status: {
    type: String,
    allowedValues: ['pending', 'completed', 'error']
  },
  documentUrl: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
}
