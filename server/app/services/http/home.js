import {route} from '@orion-js/app'

route('/', async function() {
  if (process.env.SERVER_URL.includes('alpha')) {
    return 'Sodlab API Alpha'
  } else if (process.env.SERVER_URL.includes('beta')) {
    return 'Sodlab API Beta'
  } else if (process.env.SERVER_URL.includes('apps')) {
    return 'Sodlab API'
  } else {
    return 'Sodlab Localhost'
  }
})
