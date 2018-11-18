export default {
  _id: {
    type: 'ID'
  },
  requestId: {
    type: String
  },
  userId: {
    type: String
  },
  clientId: {
    type: String
  },
  itemId: {
    type: 'ID'
  },
  collectionId: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  signedFileKey: {
    type: String
  },
  status: {
    type: String
  },
  documentUrl: {
    type: String,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date
  }
}
