import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import optionsSchema from './optionsSchema'

const fields = [
  'paymentsCollectionId',
  // 'itemId',
  'paymentReceptorIdField',
  'paymentField',
  'paymentRetentionField',
  'paymentDetailNameField',
  'clientsCollectionId',
  'receptorRutField',
  'receptorRsField',
  'receptorComunaField',
  'receptorDirectionField'
]

export default {
  name: 'Emitir Boleta de Honorarios',
  optionsSchema: optionsSchema,
  async execute({options, params}) {
    fields.map(field => {
      if (!options.hasOwnProperty(field)) {
        throw new Error('Información faltante: ' + field)
      }
    })

    const collection = await Collections.findOne(options.paymentsCollectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const paymentsDB = await collection.db()
    const item = await paymentsDB.findOne(params._id)

    if (!item) return

    const clientsCol = await Collections.findOne(options.clientsCollectionId)
    const clientsDB = await clientsCol.db()
    const client = await clientsDB.findOne(item.data[options.paymentReceptorIdField])

    const price = item.data[options.paymentField]

    const optionsRequest = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(),
        retencion: item.data[options.paymentRetentionField],
        receptor: {
          rut: clean(client.data[options.receptorRutField]),
          rs: client.data[options.receptorRsField],
          comuna: client.data[options.receptorComunaField],
          direccion: client.data[options.receptorDirectionField]
        },
        detalles: [{nombre: item.data[options.paymentDetailNameField], precio: price}],
        expects: 'all'
      }
    }

    const dte = await DTEEmission(optionsRequest, 'https://lioren.cl/api/bhe')

    const pdf = await uploadPDF(await dte, 'boletas')

    const file = {
      _id: pdf._id,
      key: pdf.key,
      bucket: pdf.bucket,
      name: pdf.name,
      type: pdf.type,
      size: pdf.size
    }

    if (options.ticketsCollectionId) {
      const ticketCol = await Collections.findOne(options.ticketsCollectionId)
      const ticketsDB = await ticketCol.db()
      await ticketsDB.insert({
        ...(options.ticketPDFField && {[options.ticketPDFField]: file}),
        ...(options.ticketIDField && {[options.ticketIDField]: dte.id}),
        ...(options.ticketFolioField && {[options.ticketFolioField]: dte.folio}),
        ...(options.ticketTotalHonorarioField && {
          [options.ticketTotalHonorarioField]: dte.totalhonorario
        }),
        ...(options.ticketTotalRetencionField && {
          [options.ticketTotalRetencionField]: dte.totalretencion
        }),
        ...(options.ticketTotalPagoField && {[options.ticketTotalPagoField]: dte.totalpago}),
        ...(options.ticketBarCodeField && {[options.ticketBarCodeField]: dte.barcode})
      })
    }
  }
}
