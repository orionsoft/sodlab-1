import {Collection} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'

export default new Collection({
  name: 'environmentusers',
  model: EnvironmentUser,
  indexes: [{keys: {userId: 1, environmentId: 1}, options: {unique: true}}]
})
