export default function({endpoint, headers}) {
  if (!endpoint.requireToken) return
  if (!endpoint.tokens) return 'No tokens in endpoint'
  if (!headers.authorization) return 'Invalid token'
  const token = headers.authorization.replace('Bearer ', '')
  if (!endpoint.tokens.includes(token)) return 'Invalid token'
}
