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
  async execute({options: params, itemId}) {
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Información faltante: ' + field)
      }
    })

    const collection = await Collections.findOne(params.ticketsCollectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const ticketsDB = await collection.db()
    const ticket = await ticketsDB.findOne(itemId)

    const clientsCol = await Collections.findOne(params.clientsCollectionId)
    const productsCol = await Collections.findOne(params.productsCollectionId)

    const clientsDB = await clientsCol.db()
    const productsDB = await productsCol.db()

    const client = await clientsDB.findOne(ticket.data[params.ticketReceptorIdField])

    const products = await Promise.all(
      ticket.data[params.ticketProductsIdsField].map(async productId => {
        return await productsDB.findOne(productId)
      })
    )
    const productsList = products.map(product => {
      return {
        nombre: product.data[params.productsNameField],
        precio: parseInt(product.data[params.productsPriceField])
      }
    })

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(ticket.data[params.ticketDateField]),
        retencion: ticket.data[params.ticketRetentionField],
        receptor: {
          rut: clean(client.data[params.receptorRutField]),
          rs: client.data[params.receptorRsField],
          comuna: client.data[params.receptorComunaField],
          direccion: client.data[params.receptorDirectionField]
        },
        detalles: productsList,
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

    await ticket.update({
      $set: {
        [`data.${params.ticketPDFField}`]: file,
        [`data.${params.ticketIDField}`]: dte.id,
        [`data.${params.ticketFolioField}`]: dte.folio,
        [`data.${params.ticketTotalHonorarioField}`]: dte.totalhonorario,
        [`data.${params.ticketTotalRetencionField}`]: dte.totalretencion,
        [`data.${params.ticketTotalPagoField}`]: dte.totalpago,
        [`data.${params.ticketBarCodeField}`]: dte.barcode
      }
    })
  }
}
