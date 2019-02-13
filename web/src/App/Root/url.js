import getEnv from './getEnv'

const urls = {
  local: `http://${window.location.hostname}:3000`,
  alpha: 'https://api.alpha.sodlab.com',
  beta: 'https://api.beta.sodlab.com',
  prod: 'https://api.apps.sodlab.com'
}

const env = getEnv()

if (env !== 'local' && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:'
}

export default urls[env]
