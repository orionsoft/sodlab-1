import Collections from 'app/collections/Collections'
import Indicators from 'app/collections/Indicators'

export default {
  name: 'Actualizar valor con un indicador',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    itemId: {
      type: String,
      label: 'Id del item'
    },
    itemIdParamName: {
      type: String,
      label: 'Nombre del parametro del ID (para pasarlo a indicadores, opcional)',
      optional: true
    },
    indicatorId: {
      type: String,
      label: 'Indicador',
      fieldType: 'indicatorSelect'
    }
  },
  async execute({
    options: {collectionId, valueKey, itemIdParamName, itemId, indicatorId},
    params,
    environmentId,
    userId
  }) {
    try {
      const col = await Collections.findOne(collectionId)
      const collection = await col.db()
      const item = await collection.findOne(itemId)
      if (!item) return

      const indicator = await Indicators.findOne(indicatorId)
      const params = {
        ...item.data,
        [itemIdParamName]: itemId
      }
      const value = await indicator.result({filterOptions: params, params, userId})

      await item.update({$set: {[`data.${valueKey}`]: value}})

      return {success: true}
    } catch (err) {
      console.log(`Error when updating a document with an indicator from env ${environmentId}`, err)
      return {success: false}
    }
  }
}
