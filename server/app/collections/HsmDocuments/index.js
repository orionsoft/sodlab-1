import {Collection} from '@orion-js/app'
import HsmDocuments from 'app/models/HsmDocuments'

export default new Collection({
  name: 'hsm_documents',
  model: HsmDocuments,
  indexes: [
    {
      keys: {requestId: 1, itemId: 1},
      unique: true
    }
  ]
})
