import Indicators from 'app/collections/Indicators'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

export default {
  name: 'Actualizar valor con un indicador',
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
    valueKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    indicatorId: {
      type: String,
      label: 'Indicador',
      fieldType: 'indicatorSelect'
    },
    itemIdParamName: {
      type: String,
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      optional: true
    },
    indicatorItemId: {
      type: String,
      label: '(opcional) ID a pasar al indicador',
      optional: true
    }
  },
  async execute({
    options: {collectionId, valueKey, indicatorItemId, itemIdParamName, itemId, indicatorId},
    environmentId,
    userId,
    hook,
    hooksData,
    viewer
  }) {
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      const indicator = await Indicators.findOne(indicatorId)
      // Backwards compatibility
      const id = indicatorItemId ? indicatorItemId : itemId
      const params = {
        ...item.data,
        [itemIdParamName]: id
      }
      const value = await indicator.result({filterOptions: params, params, userId})

      await item.update({$set: {[`data.${valueKey}`]: value}})

      const newItem = await getItemFromCollection({collectionId, itemId: item._id})
      return {start: item, result: newItem, success: true}
    } catch (err) {
      console.log(`Error when updating a document with an indicator from env ${environmentId}`, err)
      return throwHookError(err)
    }
  }
}
