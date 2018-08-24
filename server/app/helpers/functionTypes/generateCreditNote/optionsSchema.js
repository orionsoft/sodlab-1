export default {
  folio: {
    type: String,
    label: 'Folio desde el formulario'
  },
  reason: {
    type: String,
    label: 'Razón desde el formulario'
  },
  maestroProductosCollectionId: {
    type: String,
    label: 'Colección de Maestro Productos',
    fieldType: 'collectionSelect'
  },
  skuMaestroProductosCollection: {
    type: String,
    label: 'Campo SKU (de colección Maestro Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'maestroProductosCollectionId'
  },
  clientsCollectionId: {
    type: String,
    label: 'Colleción de Clientes',
    fieldType: 'collectionSelect'
  },
  pedidosCliente: {
    type: String,
    label: 'Campo Cliente (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
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
  productsSku: {
    type: String,
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
  productsDscto: {
    type: String,
    label: 'Campo Descuento Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsUnit: {
    type: String,
    label: 'Campo Unidad Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  pedidosCollectionId: {
    type: String,
    label: 'Colección de Pedidos',
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
  billCollectionId: {
    type: String,
    label: 'Colección de Factura Electrónica',
    fieldType: 'collectionSelect'
  },
  billFolio: {
    type: String,
    label: 'Campo Folio (de colección Factura Electrónica)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'billCollectionId'
  },
  billReceptor: {
    type: String,
    label: 'Campo Receptor (de colección Factura Electrónica)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'billCollectionId'
  },
  billTipodocumento: {
    type: String,
    label: 'Campo Tipo documento (de colección Factura Electrónica)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'billCollectionId'
  },
  billFechaEmision: {
    type: String,
    label: 'Campo Fecha Emisión (de colección Factura Electrónica)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'billCollectionId'
  },
  creditNoteID: {
    type: String,
    label: 'Campo para almacenar ID de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteCollectionId: {
    type: String,
    label: 'Colección de Nota de Crédito',
    fieldType: 'collectionSelect'
  },
  creditNoteID: {
    type: String,
    label: 'Campo para almacenar ID de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteTipodoc: {
    type: String,
    label: 'Campo para almacenar Tipo de Documento de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteFolio: {
    type: String,
    label: 'Campo para almacenar Folio de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteMontoNeto: {
    type: String,
    label: 'Campo para almacenar Monto Neto de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteMontoIva: {
    type: String,
    label: 'Campo para almacenar Monto Iva de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteMontoTotal: {
    type: String,
    label: 'Campo para almacenar Monto Total de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteDetalles: {
    type: String,
    label: 'Campo para almacenar Detalles de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteFechaEmision: {
    type: String,
    label: 'Campo para almacenar Fecha Emisión de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteReceptor: {
    type: String,
    label: 'Campo para almacenar Receptor de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  },
  creditNoteFile: {
    type: String,
    label: 'Campo para almacenar Archivo de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  }
}