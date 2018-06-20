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
    const finalquery = {}
    const queryname = {}
    const queryemail = {}
    if (filter) {
      queryname.profile = {firstName: {$regex: new RegExp(`^${escape(filter)}`)}}
      queryemail.emails = {
        $elemMatch: {address: {$regex: new RegExp(`^${escape(filter)}`)}}
      }
      finalquery.$or = [queryname, queryemail]
    }
    return Users.find(finalquery)
  }
})
