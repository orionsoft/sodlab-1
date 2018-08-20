import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import optionsSchema from './optionsSchema'

const fields = [
  'ticketsCollectionId',
  'ticketDateField',
  'ticketRetentionField',
  'ticketReceptorIdField',
  'ticketProductsIdsField',
  'clientsCollectionId',
  'receptorRutField',
  'receptorRsField',
  'receptorComunaField',
  'receptorDirectionField',
  'productsCollectionId',
  'productsNameField',
  'productsPriceField',
  'ticketPDFField',
  'ticketIDField',
  'ticketFolioField',
  'ticketTotalHonorarioField',
  'ticketTotalRetencionField',
  'ticketTotalPagoField',
  'ticketBarCodeField'
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

    const collection = await Collections.findOne(options.ticketsCollectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const ticketsDB = await collection.db()
    const ticket = await ticketsDB.findOne(params._id)

    const clientsCol = await Collections.findOne(options.clientsCollectionId)
    const productsCol = await Collections.findOne(options.productsCollectionId)

    const clientsDB = await clientsCol.db()
    const productsDB = await productsCol.db()

    const client = await clientsDB.findOne(ticket.data[options.ticketReceptorIdField])

    const products = await Promise.all(
      ticket.data[options.ticketProductsIdsField].map(async productId => {
        return await productsDB.findOne(productId)
      })
    )
    const productsList = products.map(product => {
      return {
        nombre: product.data[options.productsNameField],
        precio: parseInt(product.data[options.productsPriceField])
      }
    })

    const optionsRequest = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(ticket.data[options.ticketDateField]),
        retencion: ticket.data[options.ticketRetentionField],
        receptor: {
          rut: clean(client.data[options.receptorRutField]),
          rs: client.data[options.receptorRsField],
          comuna: client.data[options.receptorComunaField],
          direccion: client.data[options.receptorDirectionField]
        },
        detalles: productsList,
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

    await ticket.update({
      $set: {
        [`data.${options.ticketPDFField}`]: file,
        [`data.${options.ticketIDField}`]: dte.id,
        [`data.${options.ticketFolioField}`]: dte.folio,
        [`data.${options.ticketTotalHonorarioField}`]: dte.totalhonorario,
        [`data.${options.ticketTotalRetencionField}`]: dte.totalretencion,
        [`data.${options.ticketTotalPagoField}`]: dte.totalpago,
        [`data.${options.ticketBarCodeField}`]: dte.barcode
      }
    })
  }
}
