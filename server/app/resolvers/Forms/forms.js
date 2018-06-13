import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'

export default createPaginatedResolver({
  returns: Form,
  params: {
    filter: {
      type: String,
      optional: true
    }
  },
  async getCursor({filter}, viewer) {
    const query = {}
    if (filter) {
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Forms.find(query)
  }
})
