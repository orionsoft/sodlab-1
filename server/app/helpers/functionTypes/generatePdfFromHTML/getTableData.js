import Promise from 'bluebird'
import Tables from 'app/collections/Tables'
import tableResult from 'app/resolvers/Tables/tableResult'
import {getLoop, parseLoopData} from './interpreters'

export default async function(
  item,
  originalTemplate,
  tablesIds,
  filterParams,
  hook,
  environmentId
) {
  const tables = await getTablesData(item, tablesIds, filterParams).catch(err => {
    console.log({
      level: 'ERROR',
      message: 'An error ocurred getting the tables or filters to use when generating an PDF',
      hookName: hook.name,
      err: err.toString(),
      environmentId,
      timestamp: new Date()
    })
    return originalTemplate
  })
  if (!tables.length) return originalTemplate

  let template = originalTemplate
  let loops = template.match(/{{#table::/g) || []
  await Promise.each(loops, async function(ocurrence) {
    let loop = getLoop(template, '{{#table::', '/}}', '{{#endTable}}')
    loop = parseLoopData('table', loop, template)
    template = await replaceContent(loop, template, tables)
  }).catch(err => {
    console.log({
      level: 'ERROR',
      message: 'An error ocurred getting the data for the tables to use when generating an PDF',
      hookName: hook.name,
      err: err.toString(),
      environmentId,
      timestamp: new Date()
    })
    return originalTemplate
  })

  return template
}

async function getTablesData(item, tablesIds, filterParams) {
  if (!tablesIds || !tablesIds.length) return []

  try {
    let tables = await Promise.all(
      tablesIds.map(async (tableId, index) => {
        const table = await Tables.findOne(tableId)
        const collection = await table.collection()
        const filterId = table && table.filterByDefault ? table.filterByDefault : null

        return {
          ref: `table${index}`,
          tableId,
          collection,
          filterId,
          table
        }
      })
    )

    const filterUserParams = JSON.parse(filterParams)
    let filterOptions = {_id: item._id, ...item.data}
    for (const key in filterUserParams) {
      const param = filterUserParams[key]
      if (param === '_id') {
        filterOptions[key] = item._id
      } else if (Object.keys(item.data).includes(param)) {
        filterOptions[key] = item.data[param]
      }
    }

    tables = await Promise.all(
      tables.map(async table => {
        const result = await tableResult({...table, filterOptions})
        const items = await result.items()

        return {
          ...table,
          items
        }
      })
    )

    return tables
  } catch (err) {
    throw new Error(err)
  }
}

async function replaceContent(loop, template, tables) {
  const {startIndex, endIndex, tableRef, itemName, content} = loop
  let contentReplacement = []
  const [table] = tables.filter(table => table.ref === tableRef)
  const items = table.items

  await Promise.each(items, async item => {
    let values = await table.collection.itemValueFromAnotherCollection({item})
    let newContent = content
    const itemCompleteData = [...Object.keys(item.data), '_id']

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
          const interpretedValue = values.filter(value => value.fieldName === variable)
          if (interpretedValue.length === 0) {
            newContent = newContent.replace(textToReplace, item.data[variable])
          } else {
            newContent = newContent.replace(textToReplace, interpretedValue[0].result)
          }
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
    template.substring(endIndex + '{{#endTable}}'.length)

  return final
}
