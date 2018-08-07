import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'

const fields = [
  'collectionId',
  'date',
  'retention',
  'receptorId',
  'productsIds',
  'productsCollectionId',
  'clientsCollectionId'
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
      label: 'Campo fecha',
      fieldType: 'collectionFieldSelect'
    },
    retention: {
      type: String,
      label: 'Retención',
      fieldType: 'collectionFieldSelect'
    },
    clientsCollectionId: {
      type: String,
      label: 'Colección de Clientes',
      fieldType: 'collectionSelect'
    },
    receptorId: {
      type: String,
      label: 'Identificador Cliente',
      fieldType: 'collectionFieldSelect'
    },
    receptorRut: {
      type: String,
      label: 'Campo RUT Cliente',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    receptorRs: {
      type: String,
      label: 'Campo Razón Social Cliente',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    receptorComuna: {
      type: String,
      label: 'Campo Comuna Cliente',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    receptorDirection: {
      type: String,
      label: 'Campo Dirección Cliente',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    productsCollectionId: {
      type: String,
      label: 'Colección de Productos',
      fieldType: 'collectionSelect'
    },
    productsIds: {
      type: [String],
      label: 'Identificador Producto',
      fieldType: 'collectionFieldSelect'
    },
    productsName: {
      type: String,
      label: 'Campo Nombre Productos',
      fieldType: 'collectionFieldSelect',
      optional: true
    },
    productsPrice: {
      type: String,
      label: 'Campo Precio Productos',
      fieldType: 'collectionFieldSelect',
      optional: true
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
      return {nombre: product.data.name, precio: parseInt(product.data.price)}
    })

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId
      },
      data: {
        emisor: {
          fecha: formatDate(params.date),
          retencion: params.retention
        },
        receptor: {
          rut: client.data['rut'],
          rs: client.data['rs'],
          comuna: client.data['comuna'],
          direccion: client.data['direction']
        },
        detalles: productsList,
        expects: 'all'
      }
    }

    console.log(JSON.stringify(options))

    const dte = await DTEEmission(options)

    console.log(dte)
  }
}
