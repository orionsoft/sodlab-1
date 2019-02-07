export default {
  name: 'Fecha: Actual sin hora',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    format: {
      type: String,
      label:
        'Formato a mostrar. Ver opciones disponibles en https://momentjs.com/docs/#/displaying/format/'
    }
  },
  getRenderType: () => 'date',
  getRenderFormat: ({options}) => {
    if (!options.format.type) {
      return 'DD/MM/YYYY'
    }
    return options.format.fixed.value
  },
  async getResult() {
    const helper = new Date().setHours(0, 0, 0, 0)
    return new Date(helper)
  }
}
