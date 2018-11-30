import {putLogEvents} from 'app/helpers/cloudWatch'

export default {
  name: 'Log (para testing)',
  optionsSchema: {
    returnValue: {
      type: String,
      label: 'Valor de retorno'
    }
  },
  async execute({options, params, environmentId, userId, functionName, view}) {
    try {
      console.log('hook: log => ', options.returnValue)
      // console.log({options, params}, 'log function')
      return options.returnValue
    } catch (err) {
      const logsEvents = {
        level: 'ERROR',
        message: 'Hubo un error al ejecutar el hook de Logs',
        envId: environmentId,
        userId: userId || 'Undefined',
        function: 'Hook: Log (para testing)',
        functionName,
        view,
        file: __dirname
      }

      await putLogEvents(logsEvents)
      return null
    }
  }
}
