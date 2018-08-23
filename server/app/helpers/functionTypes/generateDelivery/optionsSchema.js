export default {
  maestroProductosCollectionId: {
    type: String,
    label: 'Colleción de Maestro Productos',
    fieldType: 'collectionSelect'
  },
  skuMaestroProductosCollection: {
    type: String,
    label: 'Campo SKU (de colección Maestro Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'maestroProductosCollectionId'
  },
  pedidosCollectionId: {
    type: String,
    label: 'Colleción de Pedidos',
    fieldType: 'collectionSelect'
  },
  pedidosMedioPago: {
    type: String,
    label: 'Campo Medio de Pago (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosGlosa: {
    type: String,
    label: 'Campo Glosa (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosCobrar: {
    type: String,
    label: 'Campo Cobrar (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosMontoTotal: {
    type: String,
    label: 'Campo Monto Total (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosId: {
    type: String,
    label: 'Campo Número de Pedido (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosCliente: {
    type: String,
    label: 'Campo Cliente (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  clientsCollectionId: {
    type: String,
    label: 'Colleción de Clientes',
    fieldType: 'collectionSelect'
  },
  receptorRut: {
    type: String,
    label: 'Campo RUT Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorRs: {
    type: String,
    label: 'Campo Razón Social Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorGiro: {
    type: String,
    label: 'Campo Giro Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorComunaCodigo: {
    type: String,
    label: 'Campo Código Comuna Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorComunaCiudad: {
    type: String,
    label: 'Campo Código Región Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorDireccion: {
    type: String,
    label: 'Campo Dirección Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  productsCollectionId: {
    type: String,
    label: 'Colección de Productos',
    fieldType: 'collectionSelect'
  },
  productsOrdersIds: {
    type: String,
    label: 'Identificador Producto (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsIds: {
    type: [String],
    label: 'Identificador Producto (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsSku: {
    type: [String],
    label: 'Sku del Producto (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsName: {
    type: String,
    label: 'Campo Nombre Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsPrice: {
    type: String,
    label: 'Campo Precio Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsQuantity: {
    type: String,
    label: 'Campo Cantidad Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsUnit: {
    type: String,
    label: 'Campo Unidad Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  deliveryCollectionId: {
    type: String,
    label: 'Colección de Guía de Despacho',
    fieldType: 'collectionSelect'
  },
  deliveryID: {
    type: String,
    label: 'Campo para almacenar ID de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryTipodoc: {
    type: String,
    label: 'Campo para almacenar Tipo de Documento de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryFolio: {
    type: String,
    label: 'Campo para almacenar Folio de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryMontoNeto: {
    type: String,
    label: 'Campo para almacenar Monto Neto de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryMontoIva: {
    type: String,
    label: 'Campo para almacenar Monto Iva de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryMontoTotal: {
    type: String,
    label: 'Campo para almacenar Monto Total de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryDetalles: {
    type: String,
    label: 'Campo para almacenar Detalles de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryTipodespacho: {
    type: String,
    label: 'Campo para almacenar Tipo Despacho de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryTipotraslado: {
    type: String,
    label: 'Campo para almacenar Tipo Traslado de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryDetalles: {
    type: String,
    label: 'Campo para almacenar Detalles de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryFile: {
    type: String,
    label: 'Campo para almacenar Archivo de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  },
  deliveryPagos: {
    type: String,
    label: 'Campo para almacenar Pagos de Guía de Despacho Emitida (de colección Guía de Despacho Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'deliveryCollectionId'
  }
}