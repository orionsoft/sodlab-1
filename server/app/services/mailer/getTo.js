import Users from 'app/collections/Users'

export default async function({address, userId, usersIds, addresses}) {
  usersIds = (userId ? (userId ? [userId] : null) : usersIds) || []
  addresses = (address ? (address ? [address] : null) : addresses) || []

  if (usersIds.length) {
    const users = await Users.find({_id: {$in: usersIds}}, {fields: {emails: 1}}).toArray()
    for (const user of users) {
      addresses.push(await user.email())
    }
  }

  return addresses.join(', ')
}
