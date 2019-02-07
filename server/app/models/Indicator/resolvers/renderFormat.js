import {resolver} from '@orion-js/app'

export default resolver({
  params: {},
  returns: String,
  async resolve(indicator, params, viewer) {
    const type = await indicator.indicatorType()
    const {options, collectionId, fieldName} = indicator
    return await type.getRenderFormat({options, collectionId, fieldName}, viewer)
  }
})
