import {setCorsOptions} from '@orion-js/app'
import {startGraphQL} from '@orion-js/graphql'
import resolvers from 'app/resolvers'
import subscriptions from 'app/subscriptions'
import {RedisPubSub} from 'graphql-redis-subscriptions'

let pubsub = null

if (process.env.REDIS_URL) {
  console.log('Using Redis Pubsub')
  pubsub = new RedisPubSub({connection: process.env.REDIS_URL})
}

startGraphQL({
  resolvers,
  subscriptions,
  pubsub
})

setCorsOptions({
  origin: '*'
})
