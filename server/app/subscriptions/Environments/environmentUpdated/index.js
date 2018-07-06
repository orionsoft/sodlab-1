import {subscription} from '@orion-js/graphql'
import Environment from 'app/models/Environment'

export default subscription({
  params: {
    environmentId: {
      type: 'ID'
    }
  },
  returns: Environment
})
