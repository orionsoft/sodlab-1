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
    }
  }
})

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
    }
  },
  returns: Result,
  async resolve({indicatorId, filterId, filterOptions}, viewer) {
    const indicator = await Indicators.findOne(indicatorId)
    const value = await indicator.result({filterId, filterOptions}, viewer)
    const renderType = await indicator.renderType({filterId, filterOptions}, viewer)
    return {
      renderType,
      value
    }
  }
})
