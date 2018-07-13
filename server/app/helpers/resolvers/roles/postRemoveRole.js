import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default async function(roleId) {
  await EnvironmentUsers.update({roles: roleId}, {$pull: {roles: roleId}}, {multi: true})
  return true
}
