import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(operator, {value}, viewer) {
    return await operator.resolve(value)
  }
})
