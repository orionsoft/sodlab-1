import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'

const fields = [
  'collectionId',
  'date',
  'retention',
  'receptorId',
  'productsIds',
  'productsCollectionId',
  'clientsCollectionId',
  'receptorRut',
  'receptorRs',
  'receptorComuna',
  'receptorDirection',
  'productsName',
  'productsPrice'
]

export default {
  name: 'Emitir Boleta de Honorarios',
  optionsSchema: {
    collectionId: {
      label: 'Colección Boletas de Honorarios',
      type: String,
      fieldType: 'collectionSelect'
    },
    date: {
      type: String,
      label: 'Fecha (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    retention: {
      type: String,
      label: 'Retención (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    clientsCollectionId: {
      type: String,
      label: 'Colección de Clientes',
      fieldType: 'collectionSelect'
    },
    receptorId: {
      type: String,
      label: 'Identificador Cliente (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    receptorRut: {
      type: String,
      label: 'Campo RUT Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorRs: {
      type: String,
      label: 'Campo Razón Social Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorComuna: {
      type: String,
      label: 'Campo Comuna Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorDirection: {
      type: String,
      label: 'Campo Dirección Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    productsCollectionId: {
      type: String,
      label: 'Colección de Productos',
      fieldType: 'collectionSelect'
    },
    productsIds: {
      type: [String],
      label: 'Identificador Producto (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    productsName: {
      type: String,
      label: 'Campo Nombre Productos (de colección Productos)',
      fieldType: 'collectionFieldSelect'
    },
    productsPrice: {
      type: String,
      label: 'Campo Precio Productos (de colección Productos)',
      fieldType: 'collectionFieldSelect'
    },
    ticketID: {
      type: String,
      label: 'Campo para almacenar ID de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    ticketFolio: {
      type: String,
      label: 'Campo para almacenar folio de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect'
    },
    ticketTotalHonorario: {
      type: String,
      label:
        'Campo para almacenar el total de honorario de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect'
    },
    ticketTotalRetencion: {
      type: String,
      label:
        'Campo para almacenar el total de retención de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect'
    },
    ticketTotalPago: {
      type: String,
      label: 'Campo para almacenar el total de pago de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect'
    },
    ticketBarCode: {
      type: String,
      label: 'Campo para almacenar Código de barras de boleta (de colección Boletas) (opcional)',
      fieldType: 'collectionFieldSelect'
    }
  },
  async execute({options: params, itemId}) {
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Información faltante')
      }
    })

    const collection = await Collections.findOne(params.collectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const clientsCol = await Collections.findOne(params.clientsCollectionId)
    const productsCol = await Collections.findOne(params.productsCollectionId)

    const clientsDB = await clientsCol.db()
    const productsDB = await productsCol.db()

    const client = await clientsDB.findOne(params.receptorId)

    const promises = params.productsIds.map(async productId => {
      return await productsDB.findOne(productId)
    })
    const products = await Promise.all(promises)
    const productsList = products.map(product => {
      return {
        nombre: product.data[params.productsName],
        precio: parseInt(product.data[params.productsPrice])
      }
    })

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(params.date),
        retencion: params.retention,
        receptor: {
          rut: clean(client.data[params.receptorRut]),
          rs: client.data[params.receptorRs],
          comuna: client.data[params.receptorComuna],
          direccion: client.data[params.receptorDirection]
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

    const ticketsDB = await collection.db()
    const ticket = await ticketsDB.findOne(itemId)
    await ticket.update({
      $set: {
        [`data.${params.ticketID}`]: dte.id,
        [`data.${params.ticketFolio}`]: dte.folio,
        [`data.${params.ticketTotalHonorario}`]: dte.totalhonorario,
        [`data.${params.ticketTotalRetencion}`]: dte.totalretencion,
        [`data.${params.ticketTotalPago}`]: dte.totalpago,
        [`data.${params.ticketBarCode}`]: dte.barcode
      }
    })
  }
}
