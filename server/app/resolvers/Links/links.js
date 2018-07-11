import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Link from 'app/models/Link'
import Links from 'app/collections/Links'

export default paginatedResolver({
  returns: Link,
  params: {
    filter: {
      type: String,
      optional: true
    },
    environmentId: {
      type: 'ID'
    }
  },
  async getCursor({filter, environmentId}, viewer) {
    const query = {environmentId}
    if (filter) {
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Links.find(query)
  }
})
