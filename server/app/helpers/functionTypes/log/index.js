export default {
  name: 'Log (para testing)',
  optionsSchema: {
    returnValue: {
      type: String,
      label: 'Valor de retorno'
    }
  },
  async execute({options, params}) {
    console.log({options, params}, 'log function')
    return options.returnValue
  }
}
