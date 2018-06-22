import {Collection} from '@orion-js/app'
import Design from 'app/models/Design'

export default new Collection({
  name: 'designs',
  model: Design,
  indexes: []
})
