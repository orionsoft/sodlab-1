import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import optionsSchema from './optionsSchema'

const fields = [
  'maestroProductosCollectionId',
  'skuMaestroProductosCollection',
  'pedidosCollectionId',
  'pedidosCliente',
  'clientsCollectionId',
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
  'deliveryCollectionId',
  'deliveryID',
  'deliveryTipodoc',
  'deliveryFolio',
  'deliveryMontoNeto',
  'deliveryMontoIva',
  'deliveryMontoTotal',
  'deliveryTipodespacho',
  'deliveryTipotraslado',
  'deliveryDetalles',
  'deliveryFile'
]

export default {
  name: 'Emitir Guía de Despacho',
  optionsSchema,
  async execute({options, params}) {
    fields.map(field => {
      if (!options.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo' + field)
      }
    })

    const deliveryCollection = await Collections.findOne(options.deliveryCollectionId)
    const orderCollection = await Collections.findOne(options.pedidosCollectionId)
    const clientsCollection = await Collections.findOne(options.clientsCollectionId)
    const productsCollection = await Collections.findOne(options.productsCollectionId)
    const masterProductsCollection = await Collections.findOne(options.maestroProductosCollectionId)

    const deliveryDB = await deliveryCollection.db()
    const clientsDB = await clientsCollection.db()
    const productsDB = await productsCollection.db()
    const ordersDB = await orderCollection.db()
    const masterProductsDB = await masterProductsCollection.db()

    const {liorenIdDelivery} = await Environments.findOne({_id: deliveryCollection.environmentId})

    if (!liorenIdDelivery) throw new Error('No hay ID de Lioren para emisión de documentos')

    const order = await ordersDB.findOne(params._id)
    const client = await clientsDB.findOne({[`data.${options.receptorRs}`]: order.data[options.pedidosCliente]})

    const productsId = await productsDB.find({[`data.${options.productsOrdersIds}`]: params._id}).toArray()

    const mapProducts = productsId.map(async product => {
      const sku = await masterProductsDB.findOne({_id: product.data[options.productsSku]})
      return {
        codigo: sku.data[options.skuMaestroProductosCollection],
        nombre: product.data[options.productsName],
        precio: parseInt(product.data[options.productsPrice]),
        cantidad: parseInt(product.data[options.productsQuantity]),
        unidad: product.data[options.productsUnit],
        exento: false
      }
    })

    const productsList = await Promise.all(mapProducts)
    const optionsRequest = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenIdDelivery,
        'Content-Type': 'application/json'
      },
      body: {
        emisor: {
          tipodoc: '52',
          tipodespacho: parseInt(order.data[options.deliveryTipodespacho]),
          tipotraslado: parseInt(order.data[options.deliveryTipotraslado]),
          fecha: formatDate()
        },
        receptor: {
          rut: clean(client.data[options.receptorRut]),
          rs: client.data[options.receptorRs],
          giro: client.data[options.receptorGiro],
          ciudad: client.data[options.receptorComunaCiudad],
          comuna: client.data[options.receptorComunaCodigo],
          direccion: client.data[options.receptorDireccion]
        },
        detalles: productsList,
        expects: 'all'
      }
    }
    const dte = await DTEEmission(optionsRequest, 'https://lioren.io/api/dtes')
    const pdf = await uploadPDF(await dte, 'facturas')
    const file = {
      _id: pdf._id,
      key: pdf.key,
      bucket: pdf.bucket,
      name: pdf.name,
      type: pdf.type,
      size: pdf.size
    }

    await deliveryDB.insert({
      [`data.${options.deliveryFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${options.deliveryID}`]: dte.id,
      [`data.${options.deliveryTipodoc}`]: dte.tipodoc,
      [`data.${options.deliveryFolio}`]: dte.folio,
      [`data.${options.deliveryMontoNeto}`]: dte.montoneto,
      [`data.${options.deliveryMontoIva}`]: dte.montoiva,
      [`data.${options.deliveryMontoTotal}`]: dte.montototal,
      [`data.${options.deliveryDetalles}`]: dte.detalles,
    })
  }
} 