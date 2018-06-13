export default function(string, regex) {
  const match = regex.exec(string)
  if (!match) return
  return match[0]
}
