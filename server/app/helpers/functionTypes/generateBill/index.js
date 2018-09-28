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
  'pedidosMedioPago',
  'pedidosGlosa',
  'pedidosCobrar',
  'pedidosId',
  'pedidosMontoTotal',
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
  'productsDscto',
  'productsUnit',
  'billsCollectionId',
  'billID',
  'billTipodoc',
  'billFolio',
  'billMontoNeto',
  'billMontoIva',
  'billMontoTotal',
  'billEstado',
  'billFile',
  'billReceptor',
  'billExento',
  'billFechaEmision'
]

export default {
  name: 'Emitir Factura Electrónica',
  optionsSchema,
  async execute({options, params}) {
    fields.map(field => {
      if (!options.hasOwnProperty(field)) {
        throw new Error('Falta completar el siguiente campo ' + field)
      }
    })

    const billCollection = await Collections.findOne(options.billsCollectionId)
    const orderCollection = await Collections.findOne(options.pedidosCollectionId)
    const clientsCollection = await Collections.findOne(options.clientsCollectionId)
    const productsCollection = await Collections.findOne(options.productsCollectionId)
    const masterProductsCollection = await Collections.findOne(options.maestroProductosCollectionId)

    const billsDB = await billCollection.db()
    const clientsDB = await clientsCollection.db()
    const productsDB = await productsCollection.db()
    const ordersDB = await orderCollection.db()
    const masterProductsDB = await masterProductsCollection.db()

    const {liorenIdBill, exempt} = await Environments.findOne({_id: billCollection.environmentId})

    if (!liorenIdBill) throw new Error('No hay ID de Lioren para emisión de documentos')

    const order = await ordersDB.findOne(params._id)
    const client = await clientsDB.findOne({
      [`data.${options.receptorRs}`]: order.data[options.pedidosCliente]
    })
    const productsId = await productsDB
      .find({[`data.${options.productsOrdersIds}`]: params._id})
      .toArray()

    const mapProducts = productsId.map(async product => {
      const sku = await masterProductsDB.findOne({_id: product.data[options.productsSku]})
      return {
        sku: sku.data[options.productsSku],
        nombre: product.data[options.productsName],
        precio: parseInt(product.data[options.productsPrice]),
        cantidad: parseInt(product.data[options.productsQuantity]),
        descuento: parseInt(product.data[options.productsDscto]) || 0,
        unidad: product.data[options.productsUnit],
        exento: exempt
      }
    })

    const productsList = await Promise.all(mapProducts)
    const optionsRequest = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenIdBill,
        'Content-Type': 'application/json'
      },
      body: {
        emisor: {
          tipodoc: '33',
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

    if (options.discountStock) {
      productsList.map(async product => {
        const query = {[`data.${options.productsSku}`]: product[options.productsSku]}

        const {data} = await masterProductsDB.findOne(query)

        await masterProductsDB.update(query, {
          $set: {
            data: {
              ...data,
              stock: data.stock - product.cantidad
            }
          }
        })
      })
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

    await billsDB.insert({
      [`data.${options.billFechaEmision}`]: formatDate(),
      [`data.${options.pedidosId}`]: order.data[options.pedidosId],
      [`data.${options.billFile}`]: `https://s3.amazonaws.com/${file.bucket}/${file.key}`,
      [`data.${options.receptorRut}`]: client.data[options.receptorRut],
      [`data.${options.receptorRs}`]: client.data[options.receptorRs],
      [`data.${options.receptorGiro}`]: client.data[options.receptorGiro],
      [`data.${options.receptorComunaCiudad}`]: client.data[options.receptorComunaCiudad],
      [`data.${options.receptorComunaCodigo}`]: client.data[options.receptorComunaCodigo],
      [`data.${options.receptorDireccion}`]: client.data[options.receptorDireccion],
      [`data.${options.billID}`]: dte.id,
      [`data.${options.billTipodoc}`]: dte.tipodoc,
      [`data.${options.billFolio}`]: dte.folio,
      [`data.${options.billMontoNeto}`]: dte.montoneto,
      [`data.${options.billMontoIva}`]: dte.montoiva,
      [`data.${options.billMontoTotal}`]: dte.montototal,
      [`data.${options.billExento}`]: dte.montoexento
    })
  }
}
