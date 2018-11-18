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
  itemsSent: {
    type: Number,
    optional: true
  },
  itemsReceived: {
    type: Number,
    optional: true
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
  completedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date
  }
}
