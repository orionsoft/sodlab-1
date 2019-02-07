import {resolver} from '@orion-js/app'
import {runSequentialHooks} from 'app/helpers/functionTypes/helpers'

export default resolver({
  params: {
    item: {
      type: 'blackbox'
    },
    success: {
      type: Boolean
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(hsmRequest, {item, success}, viewer) {
    let hooksIds = []
    if (success) {
      if (!hsmRequest.onSuccessHooksIds) return
      hooksIds = hsmRequest.onSuccessHooksIds
    } else {
      if (!hsmRequest.onErrorHooksIds) return
      hooksIds = hsmRequest.onErrorHooksIds
    }

    const {userId, shouldStopHooksOnError, environmentId} = hsmRequest
    const params = {_id: item._id, ...item.data}

    await runSequentialHooks({
      hooksIds,
      params,
      userId,
      shouldStopHooksOnError,
      environmentId
    }).catch(err => {
      const error = {
        ...err,
        customError: `An error ocurred when executing the hooks after receiving a request from the HSM`,
        hsmRequestId: hsmRequest._id,
        clientId: hsmRequest.clientId,
        userId: hsmRequest.erpUserId
      }
      console.log(error)
    })
  }
})
