export default {
  name: 'Fecha: Actual con hora',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    format: {
      type: String,
      label:
        'Formato a mostrar. Ver opciones disponibles en https://momentjs.com/docs/#/displaying/format/'
    }
  },
  getRenderType: () => 'datetime',
  getRenderFormat: ({options}) => {
    if (!options.format.type) {
      return 'DD/MM/YYYY kk:mm'
    }
    return options.format.fixed.value
  },
  async getResult() {
    return new Date()
  }
}
