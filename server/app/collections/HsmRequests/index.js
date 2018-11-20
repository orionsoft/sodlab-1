import {Collection} from '@orion-js/app'
import HsmRequest from 'app/models/HsmRequest'

export default new Collection({
  name: 'hsm_requests',
  model: HsmRequest,
  indexes: [
    {
      keys: {requestId: 1},
      unique: true
    }
  ]
})
