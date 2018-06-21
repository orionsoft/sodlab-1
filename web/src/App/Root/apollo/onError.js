import {onError} from 'apollo-link-error'
import setSession from 'App/helpers/auth/setSession'

export default onError(({graphQLErrors, networkError, response, operation}) => {
  // console.error('on error')
  if (graphQLErrors) {
    // console.error(graphQLErrors)
  }
  if (networkError) {
    if (networkError.statusCode === 400 && networkError.result.error === 'AuthError') {
      setSession(null)
    } else {
      console.error('Network error', JSON.stringify(networkError, null, 2))
    }
  }
})
