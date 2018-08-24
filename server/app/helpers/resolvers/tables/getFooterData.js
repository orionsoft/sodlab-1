import Indicators from 'app/collections/Indicators'
import isNil from 'lodash/isNil'
import numeral from 'numeral'

export const getIndicatorType = function(value, renderType) {
  if (isNil(value)) return '-'
  if (renderType === 'percentage') {
    return numeral(value).format('0.[00]%')
  }
  if (renderType === 'number') {
    return numeral(value).format('0,0.[00]')
  }
  if (renderType === 'money' || renderType === 'currency') {
    return numeral(value).format('$0,0.[00]')
  }
  if (renderType === 'boolean') {
    return value ? 'Verdadero' : 'Falso'
  }

  return value
}

export const getIndicatorResult = async function(
  indicatorId,
  params,
  filterId,
  filterOptions,
  viewer
) {
  const indicator = await Indicators.findOne(indicatorId)
  const value = await indicator.result({filterId, filterOptions, params}, viewer)
  const renderType = await indicator.renderType({filterId, filterOptions}, viewer)
  return {[indicator.title]: getIndicatorType(value, renderType)}
}

export const renderFooterItem = async function(item, parameters, filterId, filterOptions, viewer) {
  if (item.type === 'indicator') {
    return await getIndicatorResult(item.indicatorId, parameters, filterId, filterOptions, viewer)
  }
  if (item.type === 'text') {
    return {texto: item.text}
  }
  if (item.type === 'parameter') {
    return {[item.parameter]: parameters[item.parameter] || 'Parámetro Vacío'}
  }
}

export const getFooter = async function(footer, parameters, filterId, filterOptions, viewer) {
  const newFooter = Promise.all(
    footer.map(async row => {
      const cols = await row.items.map(async field => {
        return await renderFooterItem(field, parameters, filterId, filterOptions, viewer)
      })
      return await Promise.all(cols)
    })
  )
  return await newFooter
}

export default async function(footer, parameters, filterId, filterOptions, viewer) {
  const result = await getFooter(footer, parameters, filterId, filterOptions, viewer)
  return await result
}
