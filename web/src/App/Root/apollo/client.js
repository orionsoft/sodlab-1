import {ApolloClient} from 'apollo-client'
import {ApolloLink} from 'apollo-link'
import {withClientState} from 'apollo-link-state'
import cache from './cache'
import batchHttpLink from './batchHttpLink'
import onError from './onError'

const client = new ApolloClient({
  link: ApolloLink.from([
    onError,
    withClientState({
      defaults: {
        isConnected: true
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, {isConnected}, {cache}) => {
            cache.writeData({data: {isConnected}})
            return null
          }
        }
      },
      cache
    }),
    batchHttpLink
  ]),
  cache
})

global.apolloClient = client

export default client
