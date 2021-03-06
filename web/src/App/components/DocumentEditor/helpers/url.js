import getEnv from 'App/Root/getEnv'

const urls = {
  local: `http://${window.location.hostname}:8000`,
  alpha: 'https://beta.sodlab-document-editor.com',
  dev: 'https://beta.sodlab-document-editor.com',
  prod: 'https://api.sodlab-document-editor.com'
}

const env = getEnv()

export default urls[env]
