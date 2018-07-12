import {Collection} from '@orion-js/app'
import Kpi from 'app/models/Kpi'

export default new Collection({
  name: 'kpis',
  model: Kpi,
  indexes: []
})
