import {Collection} from '@orion-js/app'
import Hook from 'app/models/Hook'

export default new Collection({
  name: 'hooks',
  model: Hook,
  indexes: []
})
