const isBeta = window.location.hostname.includes('beta')
const isProduction = !isBeta && window.location.hostname.includes('sodlab.')

const forceProd = false

export default () => (isProduction || forceProd ? 'prod' : isBeta ? 'dev' : 'local')
