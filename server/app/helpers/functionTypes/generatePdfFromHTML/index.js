import createPdf from './createPdf'
import uploadPDF from './uploadPDF'
import getHTML from './getHTML'
import simpleParser from './simpleParser'
import multipleColParser from './multipleColParser'
import singleColParser from './singleColParser'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'
import getTableData from './getTableData'

export default {
  name: 'Generar PDF desde HTML',
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
      label: 'Campo donde guardar el pdf',
      fieldType: 'collectionFieldSelect'
    },
    stylesheet: {
      type: String,
      label: 'Planilla de estilos',
      fieldType: 'textArea'
    },
    template: {
      type: String,
      label: 'Template a usar',
      fieldType: 'html'
    },
    options: {
      type: String,
      label:
        '(opcional) Opciones adicionales a pasar a la configuración del HTML (en formato JSON). Ver https://github.com/marcbachmann/node-html-pdf para conocer las opciones. Por defecto se usa la siguiente: {"format": "Letter", "border": {"top": "20px", "bottom": "20px", "left": "20px", "right": "20px"}}',
      fieldType: 'textArea',
      defaultValue:
        '{"format": "Letter", "border": {"top": "20px", "bottom": "20px", "left": "20px", "right": "20px"}}',
      optional: true
    },
    tables: {
      type: [String],
      label:
        '(opcional) Usar tablas para iterar. Se refieren dentro del html en el orden en que se agregan: table1, table2,.. tableN',
      fieldType: 'tableSelect',
      fieldOptions: {
        multi: true
      },
      defaultValue: [],
      optional: true
    },
    filterParams: {
      type: String,
      label:
        '(opcional) Parámetros personalizados del item para entregar a el filtro (que está por defecto) de la tabla (formato JSON). Ej: {"nombreDelParámetroDelFiltro": "nombreDelCampoDelItem"}. Por defecto se entregan todos los parametros del item para el uso del filtro',
      fieldType: 'textArea',
      defaultValue: '{}',
      optional: true
    }
  },
  async execute({options, hook, hooksData, viewer, environmentId}) {
    const {
      collectionId,
      valueKey,
      itemId,
      stylesheet,
      template,
      options: userOptions,
      tables,
      filterParams
    } = options

    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      console.log('Could not find item in generate PDF hook', err)
      return throwHookError(err)
    }

    let itemCompleteData = [...Object.keys(item.data), '_id']
    let tableParsedContent = await getTableData(
      item,
      template,
      tables,
      filterParams,
      hook,
      environmentId
    )
    let {content, collections, activeCollections, items} = await multipleColParser(
      tableParsedContent,
      item,
      environmentId
    )
    content = await singleColParser(
      content,
      item,
      environmentId,
      collections,
      activeCollections,
      items
    )
    content = simpleParser(content, itemCompleteData, item)

    const html = getHTML(stylesheet, content)
    try {
      const file = await createPdf(html, userOptions)
      if (process.env.NODE_ENV === 'development') {
        const newItem = await getItemFromCollection({collectionId, itemId: item._id})
        return {start: item, result: newItem, success: true}
      }
      const response = await uploadPDF(file)
      const url = `https://s3.amazonaws.com/${response.bucket}/${response.key}`

      console.log({
        message: '@@@ Generated a PDF document',
        hookName: hook.name,
        url,
        environmentId,
        serverTime: new Date()
      })

      await item.update({$set: {[`data.${valueKey}`]: url}})

      const newItem = await getItemFromCollection({collectionId, itemId: item._id})
      return {start: item, result: newItem, success: true}
    } catch (err) {
      console.log({
        message: 'XXX An error ocurred generating a PDF document',
        hookName: hook.name,
        err: err.toString(),
        environmentId,
        serverTime: new Date()
      })
      return throwHookError(err)
    }
  }
}
