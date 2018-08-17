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
  async execute({options: params, itemId}) {
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo' + field)
      }
    })

    const deliveryCollection = await Collections.findOne(params.deliveryCollectionId)
    const orderCollection = await Collections.findOne(params.pedidosCollectionId)
    const clientsCollection = await Collections.findOne(params.clientsCollectionId)
    const productsCollection = await Collections.findOne(params.productsCollectionId)
    const masterProductsCollection = await Collections.findOne(params.maestroProductosCollectionId)

    const deliveryDB = await deliveryCollection.db()
    const clientsDB = await clientsCollection.db()
    const productsDB = await productsCollection.db()
    const ordersDB = await orderCollection.db()
    const masterProductsDB = await masterProductsCollection.db()

    const {liorenId, billExempt} = await Environments.findOne({_id: deliveryCollection.environmentId})

    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const order = await ordersDB.findOne(itemId)
    const client = await clientsDB.findOne({[`data.${params.receptorRs}`]: order.data[params.pedidosCliente]})

    const productsId = await productsDB.find({[`data.${params.productsOrdersIds}`]: itemId}).toArray()

    const mapProducts = productsId.map(async product => {
      const sku = await masterProductsDB.findOne({_id: product.data[params.productsSku]})
      return {
        codigo: sku.data[params.skuMaestroProductosCollection],
        nombre: product.data[params.productsName],
        precio: parseInt(product.data[params.productsPrice]),
        cantidad: parseInt(product.data[params.productsQuantity]),
        unidad: product.data[params.productsUnit],
        exento: billExempt
      }
    })

    const productsList = await Promise.all(mapProducts)
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        emisor: {
          tipodoc: '52',
          tipodespacho: parseInt(order.data[params.deliveryTipodespacho]),
          tipotraslado: parseInt(order.data[params.deliveryTipotraslado]),
          fecha: formatDate()
        },
        receptor: {
          rut: clean(client.data[params.receptorRut]),
          rs: client.data[params.receptorRs],
          giro: client.data[params.receptorGiro],
          ciudad: client.data[params.receptorComunaCiudad],
          comuna: client.data[params.receptorComunaCodigo],
          direccion: client.data[params.receptorDireccion]
        },
        detalles: productsList,
        expects: 'all'
      }
    }

    const dte = await DTEEmission(options, 'https://lioren.io/api/dtes')
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
      [`data.${params.deliveryFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${params.deliveryID}`]: dte.id,
      [`data.${params.deliveryTipodoc}`]: dte.tipodoc,
      [`data.${params.deliveryFolio}`]: dte.folio,
      [`data.${params.deliveryMontoNeto}`]: dte.montoneto,
      [`data.${params.deliveryMontoExento}`]: dte.montoexento,
      [`data.${params.deliveryMontoIva}`]: dte.montoiva,
      [`data.${params.deliveryMontoTotal}`]: dte.montototal,
      [`data.${params.deliveryDetalles}`]: dte.detalles,
    })
  }
} 