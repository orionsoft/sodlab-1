import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(field, params, viewer) {
    return {
      ...field
    }
  }
})
