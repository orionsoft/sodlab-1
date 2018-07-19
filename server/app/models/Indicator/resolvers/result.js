import {resolver} from '@orion-js/app'
import Filters from 'app/collections/Filters'
import Collections from 'app/collections/Collections'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(indicator, {filterId, filterOptions}, viewer) {
    const type = await indicator.indicatorType()

    let query = null
    let collection = null
    let fieldName = indicator.fieldName

    if (indicator.collectionId) {
      const col = await Collections.findOne(indicator.collectionId)
      collection = await col.db()
    }

    if (type.requireCollection) {
      query = {}
      if (filterId) {
        query = await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
      } else if (!indicator.allowsNoFilter) {
        throw new Error('Filter is required')
      }
    }

    const {options} = indicator
    return await type.getResult({query, collection, fieldName, options}, viewer)
  }
})
