export default function(environment, data) {
  let json = JSON.stringify(data, null, 2)
  json = json.replace(
    new RegExp(`"environmentId": "${data.environment._id}"`, 'g'),
    `"environmentId": "${environment._id}"`
  )

  for (const collection of data.collections) {
    const name = collection._id.split('_')[1]
    const newId = `${environment._id}_${name}`
    json = json.replace(`"_id": "${collection._id}"`, `"_id": "${newId}"`)
    json = json.replace(
      new RegExp(`"collectionId": "${collection._id}"`, 'g'),
      `"collectionId": "${newId}"`
    )
  }

  return JSON.parse(json)
}
