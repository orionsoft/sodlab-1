export default {
  _id: {
    type: 'ID'
  },
  requestId: {
    type: String,
    optional: true
  },
  requestTime: {
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
    allowedValues: ['initiated', 'pending', 'completed', 'incomplete', 'error']
  },
  initiatedAt: {
    type: String,
    optional: true
  },
  pendingAt: {
    type: String,
    optional: true
  },
  completedAt: {
    type: String,
    optional: true
  },
  incompleteAt: {
    type: String,
    optional: true
  },
  errorAt: {
    type: String,
    optional: true
  },
  failedDocumentsIds: {
    type: ['ID'],
    optional: true
  },
  onErrorHooksIds: {
    type: ['ID'],
    optional: true
  },
  onSuccessHooksIds: {
    type: ['ID'],
    optional: true
  },
  shouldStopHooksOnError: {
    type: Boolean,
    label: 'Detener la ejecución de los hooks si ocurre un error',
    defaultValue: false,
    optional: true
  },
  erpUserId: {
    type: 'ID',
    optional: true
  },
  createdAt: {
    type: Date
  }
}
