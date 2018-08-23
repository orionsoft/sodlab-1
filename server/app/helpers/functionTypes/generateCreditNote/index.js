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
  'maestroProductosCollectionId',
  'skuMaestroProductosCollection',
  'pedidosCollectionId',
  'pedidosCliente',
  'pedidosMedioPago',
  'pedidosGlosa',
  'pedidosCobrar',
  'pedidosMontoTotal',
  'receptorRut',
  'receptorRs',
  'receptorComunaCodigo',
  'receptorComunaCiudad',
  'receptorDireccion',
  'productsCollectionId',
  'productsOrdersIds',
  'productsSku',
  'productsName',
  'productsPrice',
  'productsQuantity',
  'productsUnit',
  'productsDscto',
  'billCollectionId',
  'billFolio',
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
  'creditNoteFile',
  'creditNoteFechaEmision',
  'creditNoteReceptor'
]

export default {
  name: 'Emitir Nota de Crédito',
  optionsSchema,
  async execute({options, params}) {
    fields.map(field => {
      if (!options.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo ' + field)
      }
    })

    const billCollection = await Collections.findOne(options.billCollectionId)
    const creditNoteCollection = await Collections.findOne(options.creditNoteCollectionId)
    const orderCollection = await Collections.findOne(options.pedidosCollectionId)
    const clientsCollection = await Collections.findOne(options.clientsCollectionId)
    const productsCollection = await Collections.findOne(options.productsCollectionId)
    const masterProductsCollection = await Collections.findOne(options.maestroProductosCollectionId)

    const billsDB = await billCollection.db()
    const creditNoteDB = await creditNoteCollection.db()
    const ordersDB = await orderCollection.db()
    const clientsDB = await clientsCollection.db()
    const masterProductsDB = await masterProductsCollection.db()
    const productsDB = await productsCollection.db()

    const {liorenIdCreditNote, exempt} = await Environments.findOne({_id: billCollection.environmentId})

    if (!liorenIdCreditNote) throw new Error('No hay ID de Lioren para emisión de documentos')

    const {data} = await billsDB.findOne({[`data.${options.billFolio}`]: parseInt(params.billID)})
    const order = await ordersDB.findOne({[`data.${options.pedidosId}`]: data[options.pedidosId]})
    const client = await clientsDB.findOne({[`data.${options.receptorRs}`]: order.data[options.pedidosCliente]})
    const productsId = await productsDB.find({[`data.${options.productsOrdersIds}`]: order._id}).toArray()

    const mapProducts = productsId.map(async product => {
      const sku = await masterProductsDB.findOne({_id: product.data[options.productsSku]})
      return {
        codigo: sku.data[options.skuMaestroProductosCollection],
        nombre: product.data[options.productsName],
        precio: parseInt(product.data[options.productsPrice]),
        cantidad: parseInt(product.data[options.productsQuantity]),
        unidad: product.data[options.productsUnit],
        descuento: parseInt(product.data[options.productsDscto]) || 0,
        exento: exempt
      }
    })

    const productsList = await Promise.all(mapProducts)

    //TODO: implement differents cases with switch

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
        receptor: {
          rut: data[options.receptorRut],
          rs: data[options.receptorRs],
          giro: data[options.receptorGiro],
          ciudad: parseInt(data[options.receptorComunaCodigo]),
          comuna: parseInt(data[options.receptorRut]),
          direccion: data[options.receptorRut]
        },
        detalles: productsList,
        referencias: [{
          fecha: data[options.billFechaEmision],
          tipodoc: data[options.billTipodocumento],
          folio: 355,
          razonref: params.razon,
          glosa: order.data[options.pedidosGlosa]
        }],
        expects: 'all'
      }
    }

    const dte = await DTEEmission(optionsRequest, 'https://lioren.io/api/dtes')
    console.log('DTE', dte)
    // console.log(JSON.stringify(optionsRequest, null, 2))
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
      [`data.${options.billFechaEmision}`]: formatDate(),
      [`data.${options.receptorRut}`]: client.data[options.receptorRut],
      [`data.${options.receptorRs}`]: client.data[options.receptorRs],
      [`data.${options.receptorGiro}`]: client.data[options.receptorGiro],
      [`data.${options.receptorComunaCiudad}`]: client.data[options.receptorComunaCiudad],
      [`data.${options.receptorComunaCodigo}`]: client.data[options.receptorComunaCodigo],
      [`data.${options.receptorDireccion}`]: client.data[options.receptorDireccion],
      [`data.${options.creditNoteFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${options.creditNoteID}`]: dte.id,
      [`data.${options.creditNoteTipodoc}`]: dte.tipodoc,
      [`data.${options.creditNoteFolio}`]: dte.folio,
      [`data.${options.creditNoteMontoNeto}`]: dte.montoneto,
      [`data.${options.creditNoteMontoIva}`]: dte.montoiva,
      [`data.${options.creditNoteMontoTotal}`]: dte.montototal
    })

  }
}