export function parseLoopData(type, loop, template) {
  switch (type) {
    case 'for': {
      // get the foor Loop {{#for::productos,pedidoId,pedidoId,producto/}}
      const extract = template.substring(loop.startIndex, loop.startIndexLineEnd)
      const cleanExtract = extract.split('::')[1].split(',')
      const content = template.substring(loop.startIndexLineEnd + '/}}'.length, loop.endIndex)

      return {
        collectionName: cleanExtract[0],
        paramName: cleanExtract[1],
        paramValue: cleanExtract[2],
        itemName: cleanExtract[3],
        content,
        ...loop
      }
    }
    case 'table': {
      // get the table data {{#table::table0/}}
      const extract = template.substring(loop.startIndex, loop.startIndexLineEnd)
      const cleanExtract = extract.split('::')[1].split(',')
      const content = template.substring(loop.startIndexLineEnd + '/}}'.length, loop.endIndex)

      return {
        tableRef: cleanExtract[0],
        itemName: cleanExtract[1],
        content,
        ...loop
      }
    }
    case 'forGet': {
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
  }
}
