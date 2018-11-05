import Collections from 'app/collections/Collections'
import {Files} from '@orion-js/file-manager'

export default {
  name: 'URL/Filemanager',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
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
  async execute({options, params, environmentId, userId}) {
    let errorObject = {
      envId: environmentId,
      function: `hook: ${this.name}`
    }
    const {collectionId, sourceField, targetKey, isForeign} = options
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(params._id)
    const origin = item.data[`${sourceField}`]

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
            return {success: true}
          } catch (err) {
            errorObject.err = err
            console.log(errorObject)
            return {success: false}
          }
        } else if (typeof origin === 'object') {
          try {
            const fileUrl = `https://s3.amazonaws.com/${origin.bucket}/${origin.key.replace(
              / /,
              '%20'
            )}`
            await item.update({$set: {[`data.${targetKey}`]: fileUrl}})
            return {success: true}
          } catch (err) {
            errorObject.err = err
            console.log(errorObject)
            return {success: false}
          }
        } else {
          return {success: false}
        }
      default:
        return {success: true}
    }
  }
}
