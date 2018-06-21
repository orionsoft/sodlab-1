import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import User from 'app/models/User'
import Users from 'app/collections/Users'

export default createPaginatedResolver({
  returns: User,
  params: {
    filter: {
      type: String,
      optional: true
    }
  },
  async getCursor({filter}, viewer) {
    const query = {}
    if (filter) {
      const regex = {$regex: new RegExp(`^${escape(filter)}`)}
      query.$or = [{'profile.firstName': regex}, {'emails.address': regex}]
    }
    return Users.find(query)
  }
})
