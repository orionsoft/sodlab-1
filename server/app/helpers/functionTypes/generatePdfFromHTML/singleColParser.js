import Collections from 'app/collections/Collections'
import Promise from 'bluebird'

export default async (
  originalTemplate,
  sourceItem,
  environmentId,
  cachedCollections,
  cachedActiveCollections,
  cachedItems
) => {
  let template = originalTemplate
  let collections = cachedCollections
  let activeCollections = cachedActiveCollections
  let items = cachedItems
  let loops = template.match(/{{#get::/g) || []
  await Promise.each(loops, async function(ocurrence) {
    let get = retrieveGetData(template)
    get = parseGetData(get, template)
    collections = await addCollectionToCache(get, collections, activeCollections, environmentId)
    template = await replaceContent(get, items, sourceItem, collections, template)
  })
  return template
}

function retrieveGetData(template) {
  let startGetIndex = template.indexOf('{{#get::', 0)
  let endGetIndex = template.indexOf('/}}', startGetIndex)
  return {startGetIndex, endGetIndex}
}

function parseGetData(get, template) {
  const extract = template.substring(get.startGetIndex, get.endGetIndex)
  const cleanExtract = extract.split('::')[1].split(',')

  return {
    collectionName: cleanExtract[0],
    searchBy: cleanExtract[1],
    searchValue: cleanExtract[2],
    prop: cleanExtract[3],
    ...get
  }
}

async function addCollectionToCache(get, collections, activeCollections, environmentId) {
  const repeated =
    activeCollections.length > 0 ? activeCollections.includes(get.collectionName) : null
  if (repeated) return collections

  const collectionId = `${environmentId}_${get.collectionName}`
  const col = await Collections.findOne(collectionId)
  const db = await col.db()
  activeCollections.push(get.collectionName)
  return {...collections, [get.collectionName]: db}
}

async function replaceContent(get, items, sourceItem, collections, template) {
  const {collectionName, searchBy, searchValue, prop, startGetIndex, endGetIndex} = get
  const db = collections[collectionName]
  const paramValue = searchValue === '_id' ? sourceItem._id : sourceItem.data[searchValue]
  let item = null
  if (searchBy === '_id') {
    item = await db.findOne(paramValue)
  } else {
    const items = await db.find({[`data.${searchBy}`]: paramValue}).toArray()
    item = items[0]
  }
  item = !item ? 'Value not found' : item
  const result = prop === '_id' ? item._id : item.data[prop]

  return (
    template.substring(0, startGetIndex) + result + template.substring(endGetIndex + '/}}'.length)
  )
}
