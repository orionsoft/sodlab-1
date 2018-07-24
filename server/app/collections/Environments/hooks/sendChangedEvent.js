import {hook} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import environmentUpdated from 'app/subscriptions/Environments/environmentUpdated'

export default hook('after.update', async function(selector) {
  const environment = await Environments.findOne(selector)
  await environmentUpdated({environmentId: environment._id}, new Date())
})
