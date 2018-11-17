import {Collection} from '@orion-js/app'
import HsmRequests from 'app/models/HsmRequests'

export default new Collection({
  name: 'hsm_requests',
  model: HsmRequests,
  indexes: [
    {
      keys: {requestId: 1},
      unique: true
    }
  ]
})
