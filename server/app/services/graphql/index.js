import {setCorsOptions} from '@orion-js/app'
import {startGraphQL} from '@orion-js/graphql'
import resolvers from 'app/resolvers'
import subscriptions from 'app/subscriptions'

startGraphQL({
  resolvers,
  subscriptions
})

setCorsOptions({
  origin: '*'
})
