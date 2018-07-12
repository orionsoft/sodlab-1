import {resolver} from '@orion-js/app'
import {validate} from '@orion-js/schema'
import getUserId from './getUserId'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import EnvironmentUser from 'app/models/EnvironmentUser'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    email: {
      type: String,
      label: 'Email',
      description: 'Ingresar Correo Electrónico',
      async custom(email) {
        try {
          await validate({email: {type: 'email'}}, {email})
        } catch (error) {
          return 'notAnEmail'
        }
      }
    }
  },
  returns: EnvironmentUser,
  mutation: true,
  async resolve({email, environmentId}, viewer) {
    const lowerCaseEmail = email.toLowerCase()
    const userId = await getUserId(lowerCaseEmail)
    const environmentUserId = await EnvironmentUsers.insert({
      userId,
      environmentId,
      email: lowerCaseEmail,
      createdAt: new Date()
    })
    return await EnvironmentUsers.findOne(environmentUserId)
  }
})
