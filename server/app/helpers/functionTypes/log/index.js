import {putLogEvents} from 'app/helpers/cloudWatch'

export default {
  name: 'Log (para testing)',
  optionsSchema: {
    returnValue: {
      type: String,
      label: 'Valor de retorno'
    }
  },
  async execute({options: {returnValue}, params, environmentId, userId, view, hook, hooksData}) {
    // try {
    //   console.log('hook: log => ', options.returnValue)
    //   // console.log({options, params}, 'log function')
    // } catch (err) {
    //   const logsEvents = {
    //     level: 'ERROR',
    //     message: 'Hubo un error al ejecutar el hook de Logs',
    //     envId: environmentId,
    //     userId: userId || 'Undefined',
    //     function: 'Hook: Log (para testing)',
    //     functionName,
    //     view,
    //     file: __dirname
    //   }

    // await putLogEvents(logsEvents)
    // }
    console.log('### Log Hook: ', returnValue)
    const {currentHookNumber} = hooksData
    if (currentHookNumber === 0) return hooksData

    const lastHookNumber = currentHookNumber === 0 ? '0' : (currentHookNumber - 1).toString()
    const lastHookResult =
      lastHookNumber === '0' ? hooksData[lastHookNumber] : hooksData[lastHookNumber].result
    return {start: lastHookResult, result: lastHookResult, success: true}
  }
}
