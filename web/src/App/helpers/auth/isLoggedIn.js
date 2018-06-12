export default function() {
  const userId = localStorage.getItem('session.userId')
  const publicKey = localStorage.getItem('session.publicKey')
  const secretKey = localStorage.getItem('session.secretKey')
  return userId && publicKey && secretKey
}
