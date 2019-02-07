import './services'
import './jobs'
import moment from 'moment-timezone'
const now = moment()
  .tz('America/Santiago')
  .format()
console.log('@@@ Server started at:', now, '(America/Santiago TZ)')
