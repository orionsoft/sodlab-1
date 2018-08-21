export default {
  folio: {
    type: String,
    label: 'Folio desde el formulario'
  },
  reason: {
    type: String,
    label: 'Razón desde el formulario'
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
  billDetalles: {
    type: String,
    label: 'Campo Detalles (de colección Factura Electrónica)',
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
  },
  creditNotePagos: {
    type: String,
    label: 'Campo para almacenar Pagos de Nota de Crédito Emitida (de colección Nota de Crédito Emitida)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'creditNoteCollectionId'
  }
}