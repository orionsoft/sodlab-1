import {resolver, Model} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'

const Result = new Model({
  name: 'IndicatorResult',
  schema: {
    value: {
      type: 'blackbox'
    },
    renderType: {
      type: String
    },
    renderFormat: {
      type: String
    }
  }
})

// temp fix. New feature added to help formatting dates. Since it's not needed by every indicator,
// this list helps to know from wich indicators we can get call the function
// In a future PR the renderFormat method should be added to every indicator and erase this list
// Number types would also benefit from this method
const renderFormatIndicatorTypes = [
  'currentDate',
  'dateOperation',
  'currentDateTime',
  'valueOfFieldInItem',
  'valueOfFieldUniqueId'
]

export default resolver({
  params: {
    indicatorId: {
      type: 'ID'
    },
    filterId: {
      type: 'ID',
      optional: true
    },
    filterOptions: {
      type: 'blackbox',
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: Result,
  async resolve({indicatorId, filterId, filterOptions, params}, viewer) {
    const indicator = await Indicators.findOne(indicatorId)
    const value = await indicator.result({filterId, filterOptions, params}, viewer)
    const renderType = await indicator.renderType({filterId, filterOptions}, viewer)
    const renderFormat = renderFormatIndicatorTypes.includes(indicator.indicatorTypeId)
      ? await indicator.renderFormat({}, viewer)
      : ''
    return {
      renderType,
      value,
      renderFormat
    }
  }
})
