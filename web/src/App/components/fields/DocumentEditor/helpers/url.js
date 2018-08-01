const isProduction = window.location.hostname.includes('sodlab')

const apiUrl = isProduction
  ? 'http://test.8wwpg2hhdp.us-east-1.elasticbeanstalk.com'
  : 'http://localhost:8000'

export default apiUrl
