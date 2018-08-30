export default {
  name: 'Generar PDF',
  optionsSchema: {
    name: {
      type: String,
      label: 'Nombre del archivo pdf'
    },
    content: {
      type: String,
      fieldType: 'richText',
      label: 'Contenido del pdf'
    }
  },
  async execute({options: {name, content}, itemId}) {
    console.log(name, content)
  }
}
