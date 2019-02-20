import moment from 'moment-timezone'
import Users from 'app/collections/Users'
import Environments from 'app/collections/Environments'
import Collections from 'app/collections/Collections'
import {hookStart, throwHookError} from '../helpers'

export default {
  name: 'Log',
  optionsSchema: {
    collectionId: {
      label:
        '(opcional) Collección. Sólo es necesaria cuando se requiere acceder a los parámetros del item en el mensaje',
      type: String,
      fieldType: 'collectionSelect',
      optional: true
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    returnValue: {
      type: String,
      label:
        'Texto a imprimir en los logs del sistema. Se pueden referenciar parámetros del item escribiéndolos entre llaves. Ej: Hola {nombre}'
    }
  },
  async execute({
    options: {collectionId, itemId, returnValue},
    viewer,
    environmentId,
    userId,
    hook,
    hooksData
  }) {
    const {timezone} = await Environments.findOne(environmentId)
    const timestamp = moment()
      .tz(timezone)
      .format()
    const user = await Users.findOne(userId)
    const userEmail = user.emails[0].address

    if (!collectionId) {
      const {currentHookNumber} = hooksData
      if (currentHookNumber === 0) return hooksData

      const lastHookNumber = currentHookNumber === 0 ? '0' : (currentHookNumber - 1).toString()
      const lastHookResult =
        lastHookNumber === '0' ? hooksData[lastHookNumber] : hooksData[lastHookNumber].result

      console.log({
        level: 'INFO',
        message: returnValue,
        userEmail,
        environmentId,
        timestamp
      })

      return {start: lastHookResult, result: lastHookResult, success: true}
    }

    try {
      const {shouldThrow} = hook
      const item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      const collection = await Collections.findOne(collectionId)
      const fields = await collection.itemValueFromAnotherCollection({item})
      const initialParams = {_id: item._id, ...item.data}
      let completeParams = {}
      for (const key in initialParams) {
        const containsKey = fields.filter(field => field.fieldName === key)
        if (containsKey.length) {
          const {result} = containsKey[0]
          completeParams[key] = result
        } else {
          completeParams[key] = initialParams[key]
        }
      }
      let message = returnValue
      for (const variable in completeParams) {
        const regexp = new RegExp(`{${escape(variable)}}`, 'g')
        message = message.replace(regexp, completeParams[variable])
      }

      console.log({
        level: 'INFO',
        message,
        userEmail,
        environmentId,
        timestamp
      })

      return {start: item, result: item, success: true}
    } catch (err) {
      return throwHookError(err)
    }
  }
}
