import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    buttonRunHooksResult: {
      type: 'blackbox'
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(button, {buttonRunHooksResult}, viewer) {
    const {hookResult} = button

    if (/^\d+$/.test(hookResult)) {
      if (hookResult === '0') {
        return buttonRunHooksResult.hooksData[hookResult]
      }
      const item = buttonRunHooksResult.hooksData[hookResult].result
      const result = {_id: item._id, ...item.data}
      return result
    }

    return buttonRunHooksResult.params
  }
})
