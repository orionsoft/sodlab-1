import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import rp from 'request-promise'
import {hookStart, throwHookError} from '../helpers'
import parseTemplate from './parseTemplate'

export default {
  name: 'Enviar datos de un item (JSON)',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    customHeaders: {
      type: String,
      fieldType: 'textArea',
      label:
        '(opcional) Headers a incluir en el request. Se escriben en formato JSON y se puede acceder a los parámetros del usuario y del item. Ej: {"Authorization":"token"}. Si el valor no coincide con ningún parametro se considerará como un valor fijo',
      optional: true,
      defaultValue: '{}'
    },
    additionalData: {
      type: String,
      fieldType: 'textArea',
      label:
        '(opcional) Datos extras a enviar en el body del request. Se escriben en formato JSON y se puede acceder a los parámetros del usuario y del item. Ej: {"nombre":"user_nombre", "estadoCompra":"estado"}. Si el valor no coincide con ningún parametro se considerará como un valor fijo',
      optional: true,
      defaultValue: '{}'
    },
    url: {
      type: String,
      label: 'URL'
    },
    environmentId: {
      type: String,
      label: '(opcional) Ambiente (default es el actual)',
      optional: true
    },
    timeoutMinutes: {
      type: Number,
      label: '(opcional) Timeout (minutos, default es 1,5 min)',
      optional: true
    }
  },
  async execute({
    options: {
      collectionId,
      itemId,
      customHeaders,
      additionalData,
      url,
      environmentId: customEnvironment,
      timeoutMinutes
    },
    environmentId: actualEnv,
    userId,
    hook,
    hooksData,
    viewer
  }) {
    const {shouldThrow} = hook
    const environmentId = customEnvironment ? customEnvironment : actualEnv

    try {
      const item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      const user = await EnvironmentUsers.findOne({userId})
      const headers = parseTemplate(item, customHeaders, user, environmentId)
      const data = parseTemplate(item, additionalData, user, environmentId)
      const timeout = timeoutMinutes ? timeoutMinutes * 60000 : 90000

      await rp({
        method: 'POST',
        uri: url,
        headers,
        body: {
          _id: item._id,
          ...item.data,
          environmentId,
          viewer,
          additionalData: data
        },
        json: true,
        timeout: timeout
      })
      return {start: item, result: item, success: true}
    } catch (err) {
      console.log(
        `Error executing the postItem hook with itemId ${itemId}, collecctionId ${collectionId} and envId ${environmentId}`,
        err
      )
      return throwHookError(err)
    }
  }
}
