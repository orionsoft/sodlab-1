import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'

export default function(query, group, total, sort) {
  let pipeline = []
  pipeline[0] = {$match: query}
  if (!checkEmptyObject(group)) {
    pipeline[1] = {
      $group: {
        _id: group,
        total: total
      }
    }
  }
  if (sort !== 0) {
    pipeline[2] = {$sort: {total: sort}}
  }
  return pipeline
}
