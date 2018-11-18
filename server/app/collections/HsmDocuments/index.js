import {Collection} from '@orion-js/app'
import HsmDocument from 'app/models/HsmDocument'

export default new Collection({
  name: 'hsm_documents',
  model: HsmDocument,
  indexes: [
    {
      keys: {itemId: 1},
      unique: true
    }
  ]
})
