const isBeta = window.location.hostname.includes('beta')
const isProduction = !isBeta && window.location.hostname.includes('waveshosting.')

const forceProd = false

export default () => (isProduction || forceProd ? 'prod' : isBeta ? 'dev' : 'local')
