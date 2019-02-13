const isAlpha = window.location.hostname.includes('alpha.')
const isBeta = window.location.hostname.includes('beta.')
const isProduction = !isAlpha && !isBeta && window.location.hostname.includes('sodlab.')

const forceProd = false

export default () =>
  isProduction || forceProd ? 'prod' : isBeta ? 'beta' : isAlpha ? 'alpha' : 'local'
