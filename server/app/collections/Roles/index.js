import {Collection} from '@orion-js/app'
import Role from 'app/models/Role'

export default new Collection({
  name: 'roles',
  model: Role,
  indexes: []
})
