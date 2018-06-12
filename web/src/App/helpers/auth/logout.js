import gql from 'graphql-tag'

export default async function() {
  await global.apolloClient.mutate({
    mutation: gql`
      mutation logout {
        logout
      }
    `
  })
  await global.apolloClient.resetStore()
}
