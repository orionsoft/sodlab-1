import schema from './schema'
import db from './db'
import drop from './drop'
import hooks from './hooks'
import field from './field'
import itemValueFromAnotherCollection from './itemValueFromAnotherCol'

export default {
  field,
  hooks,
  drop,
  db,
  schema,
  itemValueFromAnotherCollection
}
