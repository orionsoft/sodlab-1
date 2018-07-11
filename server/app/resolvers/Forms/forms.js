import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'

export default paginatedResolver({
  returns: Form,
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
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Forms.find(query)
  }
})
