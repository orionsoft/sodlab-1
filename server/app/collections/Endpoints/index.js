import {Collection} from '@orion-js/app'
import Endpoint from 'app/models/Endpoint'

export default new Collection({
  name: 'endpoints',
  model: Endpoint,
  indexes: []
})
