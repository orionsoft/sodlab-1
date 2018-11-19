export default {
  _id: {
    type: 'ID'
  },
  requestId: {
    type: String,
    optional: true
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
  status: {
    type: String,
    allowedValues: ['pending', 'completed', 'error']
  },
  requestedAt: {
    type: String,
    optional: true
  },
  completedAt: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
}
