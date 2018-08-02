import {Collection} from '@orion-js/app'

export default new Collection({
  name: 'indicator_autoIncrement_counters',
  indexes: [
    {
      keys: {name: 1, environmentId: 1},
      unique: true
    }
  ]
})
