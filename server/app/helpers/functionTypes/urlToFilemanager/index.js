import {Files} from '@orion-js/file-manager'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

export default {
  name: 'URL/Filemanager',
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
    sourceField: {
      type: String,
      label: 'Campo de origen',
      fieldType: 'collectionFieldSelect'
    },
    targetKey: {
      type: String,
      label: 'Campo de destino',
      fieldType: 'collectionFieldSelect'
    },
    isForeign: {
      label: '¿Proviene de una fuente externa al bucket de Sodlab?',
      type: Boolean,
      fieldType: 'select',
      defaultValue: false,
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      }
    }
  },
  async execute({options, hook, hooksData, viewer}) {
    const {collectionId, itemId, sourceField, targetKey, isForeign} = options
    const {shouldThrow} = hook
    let item = {}
    let origin

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      origin = item.data[`${sourceField}`]
    } catch (err) {
      return throwHookError(err)
    }

    switch (isForeign) {
      case true:
        break
      case false:
        if (typeof origin === 'string' && /^https?:.*/.test(origin)) {
          try {
            const key = origin.replace(
              `https://s3.amazonaws.com/${process.env.AWS_S3_BUCKETNAME}/`,
              ''
            )
            const filemanagerItem = await Files.findOne({key})
            const newValue = {
              _id: filemanagerItem._id,
              key: filemanagerItem.key,
              bucket: filemanagerItem.bucket,
              name: filemanagerItem.name,
              type: filemanagerItem.type,
              size: filemanagerItem.size
            }
            await item.update({$set: {[`data.${targetKey}`]: newValue}})
            const newItem = await getItemFromCollection({collectionId, itemId: item._id})
            return {start: item, result: newItem, success: true}
          } catch (err) {
            return throwHookError(err)
          }
        } else if (typeof origin === 'object') {
          try {
            const fileUrl = `https://s3.amazonaws.com/${origin.bucket}/${origin.key.replace(
              / /,
              '%20'
            )}`
            await item.update({$set: {[`data.${targetKey}`]: fileUrl}})
            const newItem = await getItemFromCollection({collectionId, itemId: item._id})
            return {start: item, result: newItem, success: true}
          } catch (err) {
            return throwHookError(err)
          }
        } else {
          const err = 'The origin field type is neither a string or an object'
          return throwHookError(err)
        }
      default:
        return {start: item, result: newItem, success: true}
    }
  }
}
