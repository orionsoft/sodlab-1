import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import optionsSchema from './optionsSchema'

const fields = [
  'folio',
  'reason',
  'pedidosCollectionId',
  'pedidosMedioPago',
  'pedidosGlosa',
  'pedidosCobrar',
  'pedidosMontoTotal',
  'billCollectionId',
  'billFolio',
  'billDetalles',
  'billReceptor',
  'billFechaEmision',
  'billTipodocumento',
  'creditNoteCollectionId',
  'creditNoteID',
  'creditNoteTipodoc',
  'creditNoteFolio',
  'creditNoteMontoNeto',
  'creditNoteMontoIva',
  'creditNoteMontoTotal',
  'creditNoteDetalles',
  'creditNoteFile',
  'creditNoteFechaEmision',
  'creditNoteReceptor',
  'creditNotePagos'
]

export default {
  name: 'Emitir Nota de Crédito',
  optionsSchema,
  async execute({options, params}) {
    fields.map(field => {
      if (!options.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo' + field)
      }
    })

    const billCollection = await Collections.findOne(options.billCollectionId)
    const creditNoteCollection = await Collections.findOne(options.creditNoteCollectionId)
    const orderCollection = await Collections.findOne(options.pedidosCollectionId)

    const billsDB = await billCollection.db()
    const creditNoteDB = await creditNoteCollection.db()
    const ordersDB = await orderCollection.db()

    const {liorenIdCreditNote} = await Environments.findOne({_id: billCollection.environmentId})

    if (!liorenIdCreditNote) throw new Error('No hay ID de Lioren para emisión de documentos')

    const {data} = await billsDB.findOne({[`data.${options.billFolio}`]: parseInt(params.billID)})
    const order = await ordersDB.findOne({[`data.${options.pedidosId}`]: data[options.pedidosId]})

    const optionsRequest = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenIdCreditNote,
        'Content-Type': 'application/json'
      },
      body: {
        emisor: {
          tipodoc: '61',
          fecha: formatDate()
        },
        receptor: data[options.billReceptor],
        detalles: data[options.billDetalles],
        pagos: [{
          fecha: formatDate(),
          mediopago: parseInt(order.data[options.pedidosMedioPago]),
          monto: parseInt(order.data[options.pedidosMontoTotal]),
          glosa: order.data[options.pedidosGlosa],
          cobrar: order.data[options.pedidosCobrar]
        }],
        referencias: [{
          fecha: data[options.billFechaEmision],
          tipodoc: data[options.billTipodocumento],
          folio: data[options.billFolio],
          razonref: params.razon,
          glosa: params.glosa
        }],
        expects: 'all'
      }
    }

    const dte = await DTEEmission(optionsRequest, 'https://lioren.io/api/dtes')
    const pdf = await uploadPDF(await dte, 'nota de crédito')
    const file = {
      _id: pdf._id,
      key: pdf.key,
      bucket: pdf.bucket,
      name: pdf.name,
      type: pdf.type,
      size: pdf.size
    }

    await creditNoteDB.insert({
      [`data.${options.creditNoteFechaEmision}`]: formatDate(),
      [`data.${options.creditNoteReceptor}`]: data[options.billReceptor],
      [`data.${options.creditNoteFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${options.creditNoteID}`]: dte.id,
      [`data.${options.creditNoteTipodoc}`]: dte.tipodoc,
      [`data.${options.creditNoteFolio}`]: dte.folio,
      [`data.${options.creditNoteMontoNeto}`]: dte.montoneto,
      [`data.${options.creditNoteMontoIva}`]: dte.montoiva,
      [`data.${options.creditNoteMontoTotal}`]: dte.montototal,
      [`data.${options.creditNoteDetalles}`]: dte.detalles,
      [`data.${options.creditNotePagos}`]: dte.pagos,
    })

  }
}