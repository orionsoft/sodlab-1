import getSession from './getSession'

export default function() {
  return !!getSession().userId
}
