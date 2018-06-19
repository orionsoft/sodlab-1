import {Collection} from '@orion-js/app'
import Table from 'app/models/Table'

export default new Collection({
  name: 'tables',
  model: Table,
  indexes: []
})
