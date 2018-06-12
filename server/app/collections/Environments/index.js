import {Collection} from '@orion-js/app'
import Environment from 'app/models/Environment'

export default new Collection({
  name: 'environments',
  model: Environment,
  indexes: []
})
