import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'

export default function(query, group, total, sort) {
  let pipeline = []
  const shouldCount = Object.keys(total).includes('count')
  pipeline[0] = {$match: query}
  if (!checkEmptyObject(group)) {
    pipeline[1] = shouldCount
      ? {
          $group: {
            _id: group,
            ...total
          }
        }
      : {
          $group: {
            _id: group,
            total: total
          }
        }
  }
  if (sort !== 0) {
    pipeline[2] = shouldCount ? {$sort: {count: sort}} : {$sort: {total: sort}}
  }
  return pipeline
}
