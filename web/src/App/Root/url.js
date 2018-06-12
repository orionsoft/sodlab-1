import getEnv from './getEnv'

const urls = {
  local: `http://${window.location.hostname}:3000`,
  dev: 'http://api.beta.waveshosting.com',
  prod: 'https://api.waveshosting.com'
}

const env = getEnv()

export default urls[env]
