import {resolver} from '@orion-js/app'
import Filters from 'app/collections/Filters'
import Collections from 'app/collections/Collections'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(indicator, {filterId, filterOptions, params}, viewer) {
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

    const {environmentId} = indicator
    const options = await indicator.getOptions({params})
    return await type.getResult({query, collection, fieldName, options, environmentId}, viewer)
  }
})
