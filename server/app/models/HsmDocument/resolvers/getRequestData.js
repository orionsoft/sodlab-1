import {resolver} from '@orion-js/app'
import HsmRequests from 'app/collections/HsmRequests'

export default resolver({
  params: {
    requestId: {
      type: String
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(hsmDocument, {requestId}, viewer) {
    const hsmRequest = await HsmRequests.findOne({requestId: hsmDocument.requestId})
    return hsmRequest
  }
})
