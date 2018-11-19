import {resolver} from '@orion-js/app'
import HsmRequests from 'app/collections/HsmRequests'
import formatCurrentDate from 'app/helpers/misc/formatDate'
import formatCurrentTime from 'app/helpers/misc/formatTime'

export default resolver({
  params: {
    dateObject: {
      type: Date
    },
    field: {
      type: String
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(hsmRequest, {dateObject, field}, viewer) {
    const {createdAt} = hsmRequest
    const formattedDate = formatCurrentDate(createdAt)
    const formattedTime = formatCurrentTime(createdAt)
    const formatted = `${formattedDate}_${formattedTime}`
    hsmRequest.update({$set: {[field]: formatted}})
  }
})
