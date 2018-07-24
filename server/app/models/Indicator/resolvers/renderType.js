import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    filterId: {
      type: 'ID',
      optional: true
    },
    filterOptions: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: String,
  async resolve(indicator, params, viewer) {
    const type = await indicator.indicatorType()
    const {options} = indicator
    return await type.getRenderType({options}, viewer)
  }
})
