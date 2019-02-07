export default function(item, rawTemplate, user, environmentId) {
  let data = {}
  const template = JSON.parse(rawTemplate)
  const itemKeys = Object.keys(item)
  const userKeys = Object.keys(user.profile)

  for (const key in template) {
    const fieldValue = template[key]
    if (fieldValue === '_id') {
      data = {...data, [key]: item._id}
    } else if (userKeys.includes(fieldValue)) {
      data = {...data, [key]: user.profile[fieldValue]}
    } else if (itemKeys.includes(fieldValue)) {
      data = {...data, [key]: item.data[fieldValue]}
    } else if (fieldValue === environmentId) {
      data = {...data, [key]: environmentId}
    } else {
      data = {...data, [key]: fieldValue}
    }
  }

  return data
}
