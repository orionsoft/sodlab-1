import getEnv from './getEnv'

const urls = {
  local: `http://${window.location.hostname}:3000`,
  dev: 'http://api.beta.sodlab.com',
  prod: 'https://api.sodlab.com'
}

const env = getEnv()

export default urls[env]
