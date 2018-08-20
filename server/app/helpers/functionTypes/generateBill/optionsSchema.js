export default {
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
  pedidosCollectionId: {
    type: String,
    label: 'Colección de Pedidos',
    fieldType: 'collectionSelect'
  },
  pedidosCliente: {
    type: String,
    label: 'Campo Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  clientsCollectionId: {
    type: String,
    label: 'Colección de Clientes',
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
  productsUnit: {
    type: String,
    label: 'Campo Unidad Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  billsCollectionId: {
    label: 'Colección de Factura Electrónica',
    type: String,
    fieldType: 'collectionSelect'
  },
  billID: {
    type: String,
    label: 'Campo para almacenar ID de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billTipodoc: {
    type: String,
    label: 'Campo para almacenar Tipo de Documento(de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billFolio: {
    type: String,
    label: 'Campo para almacenar Folio de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billMontoNeto: {
    type: String,
    label: 'Campo para almacenar Monto Neto de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billMontoExento: {
    type: String,
    label: 'Campo para almacenar Monto Exento de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billMontoIva: {
    type: String,
    label: 'Campo para almacenar Monto Iva de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionId'
  },
  billMontoTotal: {
    type: String,
    label: 'Campo para almacenar Monto Total de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionID'
  },
  billDetalles: {
    type: String,
    label: 'Campo para almacenar Detalles de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionID'
  },
  billEstado: {
    type: String,
    label: 'Campo para almacenar estado de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionID'
  },
  billFile: {
    type: String,
    label: 'Campo para almacenar Archivo de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentsCollection: 'billsCollectionID'
  }
}