import {Collection} from '@orion-js/app'
import Indicator from 'app/models/Indicator'

export default new Collection({
  name: 'indicators',
  model: Indicator,
  indexes: []
})
