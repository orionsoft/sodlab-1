import Notifications from 'app/collections/Notifications'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import notificationInserted from 'app/subscriptions/Environments/notificationInserted'

export default {
  name: 'Notificar',
  optionsSchema: {
    title: {
      type: String,
      label: 'Título'
    },
    content: {
      type: String,
      label: 'Asunto'
    },
    path: {
      type: String,
      label: 'Ruta (opcional)',
      optional: true,
      custom(path, {currentDoc}) {
        if (path && !path.startsWith('/')) return 'invalidPath'
      }
    },
    roles: {
      type: [String],
      label: 'Roles',
      min: 0,
      fieldType: 'roleSelect',
      fieldOptions: {
        multi: true
      }
    }
  },
  async execute(
    {
      options: {title, content, path, roles},
      environmentId,
      params,
      userId
    },
    viewer
  ) {
    let newContent = content
    let newTitle = title

    Object.keys(params).forEach(variable => {
      const regexp = new RegExp(`{${escape(variable)}}`, 'g')
      newContent = newContent.replace(regexp, params[variable])
      newTitle = newTitle.replace(regexp, params[variable])
    })

    let environmentUser

    try {
      environmentUser = await EnvironmentUsers.findOne({userId, environmentId})
    } catch (err) {
      console.log(
        `Error executing notification hook from env ${environmentId}, with user ${userId}`,
        err
      )
      return {success: false}
    }

    try {
      await Notifications.insert({
        title: newTitle,
        content: newContent,
        environmentId,
        path,
        roles,
        notifierId: environmentUser._id,
        createdAt: new Date()
      })
    } catch (err) {
      console.log(`Error executing notification hook, when trying to create the notification`, err)
      return {success: false}
    }

    try {
      await notificationInserted({environmentId: environmentId}, 'notification')
    } catch (err) {
      console.log(`Error executing notification hook, when trying to notify the user`, err)
      return {success: false}
    }

    return {success: true}
  }
}
