import difference from 'lodash/difference'
import {generateId} from '@orion-js/app'

export default function(environment, data) {
  let json = JSON.stringify(data, null, 2)

  const notUpdate = ['exportVersion', 'environment', 'collections']
  const keys = difference(Object.keys(data), notUpdate)

  for (const key of keys) {
    const items = data[key]
    for (const item of items) {
      const newId = generateId()
      json = json.replace(new RegExp(`"${item._id}"`, 'g'), `"${newId}"`)
    }
  }
  return JSON.parse(json)
}
