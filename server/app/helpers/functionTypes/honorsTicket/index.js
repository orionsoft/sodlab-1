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
  async execute({options: params, itemId}) {
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Información faltante: ' + field)
      }
    })

    const collection = await Collections.findOne(params.paymentsCollectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const paymentsDB = await collection.db()
    const item = await paymentsDB.findOne(itemId)

    if (!item) return

    const clientsCol = await Collections.findOne(params.clientsCollectionId)
    const clientsDB = await clientsCol.db()
    const client = await clientsDB.findOne(item.data[params.paymentReceptorIdField])

    const price = item.data[params.paymentField]

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(),
        retencion: item.data[params.paymentRetentionField],
        receptor: {
          rut: clean(client.data[params.receptorRutField]),
          rs: client.data[params.receptorRsField],
          comuna: client.data[params.receptorComunaField],
          direccion: client.data[params.receptorDirectionField]
        },
        detalles: [{nombre: item.data[params.paymentDetailNameField], precio: price}],
        expects: 'all'
      }
    }

    const dte = await DTEEmission(options, 'https://lioren.cl/api/bhe')

    const pdf = await uploadPDF(await dte, 'boletas')

    const file = {
      _id: pdf._id,
      key: pdf.key,
      bucket: pdf.bucket,
      name: pdf.name,
      type: pdf.type,
      size: pdf.size
    }

    if (params.ticketsCollectionId) {
      const ticketCol = await Collections.findOne(params.ticketsCollectionId)
      const ticketsDB = await ticketCol.db()
      await ticketsDB.insert({
        ...(params.ticketPDFField && {[params.ticketPDFField]: file}),
        ...(params.ticketIDField && {[params.ticketIDField]: dte.id}),
        ...(params.ticketFolioField && {[params.ticketFolioField]: dte.folio}),
        ...(params.ticketTotalHonorarioField && {
          [params.ticketTotalHonorarioField]: dte.totalhonorario
        }),
        ...(params.ticketTotalRetencionField && {
          [params.ticketTotalRetencionField]: dte.totalretencion
        }),
        ...(params.ticketTotalPagoField && {[params.ticketTotalPagoField]: dte.totalpago}),
        ...(params.ticketBarCodeField && {[params.ticketBarCodeField]: dte.barcode})
      })
    }
  }
}
