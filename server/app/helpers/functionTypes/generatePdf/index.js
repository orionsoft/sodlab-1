import * as JsPDF from 'jspdf'

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
    var doc = new JsPDF()

    doc.text('Hello world!', 10, 10)
    doc.save('a4.pdf')
  }
}
