import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'
import Filters from 'app/collections/Filters'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(chart, {params, filterId, filterOptions}, viewer) {
    const chartType = await chart.chartType()
    const options = await chart.getOptions({params})

    let query = null
    let collection = null

    const {collectionId} = chart
    if (collectionId) {
      const col = await Collections.findOne(collectionId)
      collection = await col.db()
    }

    if (!filterId && !chart.allowsNoFilter && chart.filtersIds.length === 1) {
      filterId = chart.filtersIds[0]
    }

    query = {}
    if (filterId) {
      query = await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
    } else if (!chart.allowsNoFilter) {
      throw new Error('Filter is required')
    }

    return await chartType.getData({options, params, query, collectionId, collection, chart})
  }
})
