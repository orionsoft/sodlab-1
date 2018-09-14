import Notifications from 'app/collections/Notifications'

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
      params
    },
    viewer
  ) {
    await Notifications.insert({
      title,
      content,
      environmentId,
      path,
      roles,
      readed: false,
      createdAt: new Date()
    })
  }
}
