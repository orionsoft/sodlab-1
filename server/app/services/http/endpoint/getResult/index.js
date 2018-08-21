import list from './list'
import view from './view'

export default async function({endpoint, parameters}) {
  if (endpoint.type === 'list') {
    return await list({endpoint, parameters})
  } else if (endpoint.type === 'view') {
    return await view({endpoint, parameters})
  } else if (endpoint.type === 'form') {
    return {poop: 'form'}
  }
}
