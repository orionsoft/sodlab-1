import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Validation from 'app/models/Validation'
import Validations from 'app/collections/Validations'

export default paginatedResolver({
  returns: Validation,
  params: {
    filter: {
      type: String,
      optional: true
    },
    environmentId: {
      type: 'ID'
    }
  },
  role: 'admin',
  async getCursor({filter, environmentId}, viewer) {
    const query = {environmentId}

    if (filter) {
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }

    return Validations.find(query).sort({name: 1})
  }
})
