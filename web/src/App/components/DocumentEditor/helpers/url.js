const isProduction = window.location.hostname.includes('sodlab')

const apiUrl = isProduction
  ? 'http://test2.8wwpg2hhdp.us-east-1.elasticbeanstalk.com'
  : 'http://192.168.2.153:8000'

export default apiUrl
