import {hook} from '@orion-js/app'
import environmentUpdated from 'app/subscriptions/Environments/environmentUpdated'

export default function() {
  const send = environmentId => {
    if (!environmentId) return
    environmentUpdated({environmentId}, new Date())
  }
  return [
    hook('after.insert', async function(item) {
      await send(item.environmentId)
    }),
    hook('after.update', async function(selector) {
      const item = await this.collection.findOne(selector, {fields: {environmentId: 1}})
      await send(item.environmentId)
    }),
    hook('after.remove', async function(selector) {
      const item = await this.collection.findOne(selector, {fields: {environmentId: 1}})
      await send(item.environmentId)
    })
  ]
}
