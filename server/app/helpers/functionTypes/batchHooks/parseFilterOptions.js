export function parseFilterOptions({rawFilterOptions, params, item}) {
  let filterOptions = {}
  const parsedFilterOptions = JSON.parse(rawFilterOptions)
  for (const key in parsedFilterOptions) {
    const value = parsedFilterOptions[key]
    if (value.includes('param.')) {
      const fieldName = value.replace('param.', '')
      const fieldValue = params[fieldName]
      filterOptions = {...filterOptions, [key]: fieldValue}
    } else if (value.includes('item.')) {
      const fieldName = value.replace('item.', '')
      const fieldValue = item[fieldName]
      filterOptions = {...filterOptions, [key]: fieldValue}
    } else {
      filterOptions = {...filterOptions, [key]: value}
    }
  }

  return filterOptions
}
