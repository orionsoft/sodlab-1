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
  'billsCollectionId',
  'billID',
  'billTipodoc',
  'billFolio',
  'billMontoNeto',
  'billMontoExento',
  'billMontoIva',
  'billMontoTotal',
  'billDetalles',
  'billEstado',
  'billFile'
]

export default {
  name: 'Emitir Factura Electrónica',
  optionsSchema,
  async execute({options: params, itemId}) {
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo' + field)
      }
    })

    const billCollection = await Collections.findOne(params.billsCollectionId)
    const orderCollection = await Collections.findOne(params.pedidosCollectionId)
    const clientsCollection = await Collections.findOne(params.clientsCollectionId)
    const productsCollection = await Collections.findOne(params.productsCollectionId)
    const masterProductsCollection = await Collections.findOne(params.maestroProductosCollectionId)

    const billsDB = await billCollection.db()
    const clientsDB = await clientsCollection.db()
    const productsDB = await productsCollection.db()
    const ordersDB = await orderCollection.db()
    const masterProductsDB = await masterProductsCollection.db()

    const {liorenId, billExempt} = await Environments.findOne({_id: billCollection.environmentId})

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
          tipodoc: '33',
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

    await billsDB.insert({
      [`data.${params.billFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${params.billID}`]: dte.id,
      [`data.${params.billTipodoc}`]: dte.tipodoc,
      [`data.${params.billFolio}`]: dte.folio,
      [`data.${params.billMontoNeto}`]: dte.montoneto,
      [`data.${params.billMontoExento}`]: dte.montoexento,
      [`data.${params.billMontoIva}`]: dte.montoiva,
      [`data.${params.billMontoTotal}`]: dte.montototal,
      [`data.${params.billDetalles}`]: dte.detalles
    })

    const {data} = await ordersDB.findOne(itemId)
    await ordersDB.update(itemId, {
      $set: {
        [`data.${params.billEstado}`]: 'facturado',
        ...data
      }
    })
  }
}