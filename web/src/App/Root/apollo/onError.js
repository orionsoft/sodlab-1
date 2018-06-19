import {onError} from 'apollo-link-error'

export default onError(({graphQLErrors, networkError, response, operation}) => {
  // console.error('on error')
  if (graphQLErrors) {
    // console.error(graphQLErrors)
  }
  if (networkError) {
    if (networkError.statusCode === 400 && networkError.result.error === 'AuthError') {
      localStorage.setItem('session', '')
      global.apolloClient.resetStore()
    } else {
      console.error('Network error', JSON.stringify(networkError, null, 2))
    }
  }
})
