import {createClient} from '@orion-js/graphql-client'
import url from './url'

const sessionKey = 'sodlabSession'

export default createClient({
  endpointURL: url,
  saveSession(session) {
    localStorage.setItem(sessionKey, JSON.stringify(session, null, 2))
  },
  getSession(session) {
    try {
      return JSON.parse(localStorage.getItem(sessionKey))
    } catch (e) {
      return {}
    }
  }
})
