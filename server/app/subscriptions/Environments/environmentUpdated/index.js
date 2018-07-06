import {subscription} from '@orion-js/graphql'
import Environment from 'app/models/Environment'

export default subscription({
  params: {
    environmentId: {
      type: 'ID',
      description: 'Recieves the environment or the url',
      optional: true
    },
    url: {
      type: String,
      optional: true
    }
  },
  returns: Environment,
  async resolve({environmentId, url}, viewer) {
    console.log('hello')
  }
})
