import {Collection} from '@orion-js/app'

export default new Collection({
  name: 'sign_documents_with_hsm_requests',
  indexes: [
    {
      keys: {requestId: 1},
      unique: true
    }
  ]
})
