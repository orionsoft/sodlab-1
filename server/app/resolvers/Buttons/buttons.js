import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Button from 'app/models/Button'
import Buttons from 'app/collections/Buttons'

export default paginatedResolver({
  returns: Button,
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
      query.title = {$regex: new RegExp(`^${escape(filter)}`)}
    }

    return Buttons.find(query).sort({name: 1})
  }
})
