import Collections from 'app/collections/Collections'
import Promise from 'bluebird'
import {getLoop, parseLoopData} from './interpreters'

export default async (originalTemplate, sourceItem, environmentId) => {
  let template = originalTemplate
  let collections = {}
  let activeCollections = []
  let items = {}

  let loops = template.match(/{{#for::/g) || []
  await Promise.each(loops, async function(ocurrence, index) {
    let loop = getLoop(template, '{{#for::', '/}}', '{{#endFor}}')
    loop = parseLoopData('for', loop, template)
    collections = await addCollectionToCache(
      loop.collectionName,
      collections,
      activeCollections,
      environmentId
    )
    items = await addItemToCache(loop, items, sourceItem, collections)
    template = await replaceContent(
      loop,
      template,
      items,
      collections,
      activeCollections,
      environmentId
    )
  })
  return {content: template, collections, activeCollections, items}
}

async function addCollectionToCache(collectionName, collections, activeCollections, environmentId) {
  const collectionId = `${environmentId}_${collectionName}`
  const col = await Collections.findOne(collectionId)
  const db = await col.db()
  activeCollections.push(collectionName)
  return {...collections, [collectionName]: db}
}

async function addItemToCache(loop, items, sourceItem, collections) {
  const {collectionName, paramName, paramValue, itemName} = loop
  const itemId = paramValue === '_id' ? sourceItem._id : sourceItem.data[paramValue]
  const db = collections[collectionName]

  if (paramName === '_id') {
    const result = await db.findOne(itemId)
    return {...items, [`${itemName}`]: new Array(result)}
  } else {
    const results = await db.find({[`data.${paramName}`]: itemId}).toArray()
    return {...items, [`${itemName}`]: results}
  }
}

async function replaceContent(
  loop,
  template,
  items,
  collections,
  activeCollections,
  environmentId
) {
  const {content, itemName, startIndex, endIndex} = loop

  let contentReplacement = []
  await Promise.each(items[itemName], async item => {
    let newContent = content
    // replace content inside for loops written like {{#forGet::maestroproductos,sku,sku,sku/}} using the variable product of the for loop
    let loops = newContent.match(/{{#forGet::/g) || []
    await Promise.each(loops, async ocurrence => {
      newContent = await forGetReplaceContent(
        newContent,
        item,
        collections,
        activeCollections,
        environmentId
      )
    })
    const itemCompleteData = [...Object.keys(item.data), '_id']
    // replace content inside for loops written like {{producto.cantidad}} using the variable product of the for loop
    itemCompleteData.forEach(variable => {
      // TODO: apply custom functions to the values, the idea is to write the content like: {{producto.precio.formatNumber::args}}
      // then use a regexp like /{{(\w+)\.(\w+)?.?(\w+)?([:\w,]+)}}/i
      // then retrieve the name of the function to use from the 3rd group and the params from the 4th from the regexpMatch
      const regexp = new RegExp(`{{(${itemName}).(${variable})}}`)
      const test = regexp.test(newContent)
      if (test) {
        const regexpMatch = regexp.exec(newContent)
        if (!regexpMatch) return
        const textToReplace = regexpMatch[0]
        if (variable === '_id') {
          newContent = newContent.replace(textToReplace, item._id)
        } else {
          newContent = newContent.replace(textToReplace, item.data[variable])
        }
      }
    })
    if (newContent === content) return null
    contentReplacement.push(newContent)
  })

  contentReplacement = contentReplacement.join('')
  const final =
    template.substring(0, startIndex) +
    contentReplacement +
    template.substring(endIndex + '{{#endFor}}'.length)

  return final
}

// replace content inside for loops written like {{#forGet::maestroproductos,sku,sku,sku/}} using the variable product of the for loop
async function forGetReplaceContent(content, item, collections, activeCollections, environmentId) {
  let forGet = deepGetForLoop(content)
  forGet = parseForGetData(content, forGet.startIndex, forGet.endIndex)
  let newCollections = await addCollectionToCache(
    forGet.collectionName,
    collections,
    activeCollections,
    environmentId
  )
  const text = await deepReplaceContent(forGet, item, newCollections, content)
  return text
}

function deepGetForLoop(template) {
  const startIndex = template.indexOf('{{#forGet::', 0)
  const endIndex = template.indexOf('/}}', startIndex)
  return {startIndex, endIndex}
}

function parseForGetData(template, startIndex, endIndex) {
  const extract = template.substring(startIndex, endIndex)
  const cleanExtract = extract.split('::')[1].split(',')

  return {
    collectionName: cleanExtract[0],
    searchBy: cleanExtract[1],
    searchValue: cleanExtract[2],
    prop: cleanExtract[3],
    startIndex,
    endIndex
  }
}

async function deepReplaceContent(get, sourceItem, collections, template) {
  const {collectionName, searchBy, searchValue, prop, startIndex, endIndex} = get
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
  const text =
    template.substring(0, startIndex) + result + template.substring(endIndex + '/}}'.length)
  return text
}
