import Notifications from 'app/collections/Notifications'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import notificationInserted from 'app/subscriptions/Environments/notificationInserted'
import {hookStart, throwHookError} from '../helpers'

export default {
  name: 'Notificar',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
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
      userId
    },
    viewer
  ) {
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }
    let newContent = content
    let newTitle = title
    let params = {_id: item._id, ...item.data}
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
        `Error cannot find the user ${userId} in ${environmentId} to send notifications to`,
        err
      )
      return throwHookError(err)
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
      return throwHookError(err)
    }

    try {
      await notificationInserted({environmentId: environmentId}, 'notification')
    } catch (err) {
      console.log(`Error executing notification hook, when trying to notify the user`, err)
      return throwHookError(err)
    }

    return {start: item, result: item, success: true}
  }
}
