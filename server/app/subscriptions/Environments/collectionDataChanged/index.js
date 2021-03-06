import {subscription} from '@orion-js/graphql'

export default subscription({
  params: {
    environmentId: {
      type: 'ID'
    },
    collectionId: {
      type: 'ID'
    }
  },
  returns: String
})
