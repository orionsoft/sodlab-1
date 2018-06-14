import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(form, params, viewer) {
    const collection = await form.collection()
    return await collection.schema()
  }
})
