import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'

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
    ticketPdf: {
      type: String,
      label: 'Campo para almacenar pdf (de colección Boletas)',
      fieldType: 'collectionFieldSelect'
    },
    ticketIdDoc: {
      type: String,
      label: 'Campo para almacenar id de documento (de colección Boletas)',
      fieldType: 'collectionFieldSelect'
    }
  },
  async execute(params) {
    console.log({params})
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

    console.log(JSON.stringify(options, undefined, 4))

    const dte = await DTEEmission(options)

    console.log(await dte)
  }
}
