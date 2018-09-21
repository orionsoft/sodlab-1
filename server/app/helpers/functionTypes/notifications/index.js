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
    let newContent = content
    let newTitle = title
    Object.keys(params).forEach(variable => {
      const regexp = new RegExp(`{${escape(variable)}}`, 'g')
      newContent = newContent.replace(regexp, params[variable])
      newTitle = newTitle.replace(regexp, params[variable])
    })
    await Notifications.insert({
      title: newTitle,
      content: newContent,
      environmentId,
      path,
      roles,
      readed: false,
      createdAt: new Date()
    })
  }
}
