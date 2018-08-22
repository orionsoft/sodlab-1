import {json} from 'micro'
import isEmpty from 'lodash/isEmpty'

export default async function({request, query}) {
  if (!isEmpty(query)) {
    return query
  } else {
    try {
      return await json(request)
    } catch (e) {
      return {}
    }
  }
}
