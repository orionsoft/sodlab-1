import {json} from 'micro'

export default async function(request) {
  return await json(request)
}
