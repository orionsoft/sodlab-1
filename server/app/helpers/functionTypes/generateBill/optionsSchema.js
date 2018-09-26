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
  pedidosCliente: {
    type: String,
    label: 'Campo Cliente (de colección Pedidos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'pedidosCollectionId'
  },
  pedidosId: {
    type: String,
    label: 'Campo Número de Pedido (de colección Pedidos)',
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
    label: 'Identificador Producto Pedidos(de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsSku: {
    type: String,
    label: 'Sku del Producto (de colección Productos)',
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
  productsDscto: {
    type: String,
    label: 'Campo Descuento Productos (de colección Productos)',
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
    type: String,
    label: 'Colección de Factura Electrónica',
    fieldType: 'collectionSelect'
  },
  billID: {
    type: String,
    label:
      'Campo para almacenar ID de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionId'
  },
  billTipodoc: {
    type: String,
    label: 'Campo para almacenar Tipo de Documento(de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionId'
  },
  billFolio: {
    type: String,
    label:
      'Campo para almacenar Folio de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionId'
  },
  billMontoNeto: {
    type: String,
    label:
      'Campo para almacenar Monto Neto de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionId'
  },
  billMontoIva: {
    type: String,
    label:
      'Campo para almacenar Monto Iva de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionId'
  },
  billMontoTotal: {
    type: String,
    label:
      'Campo para almacenar Monto Total de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionID'
  },
  billExento: {
    type: String,
    label:
      'Campo para almacenar Exento de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionID'
  },
  billEstado: {
    type: String,
    label:
      'Campo para almacenar estado de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionID'
  },
  billReceptor: {
    type: String,
    label:
      'Campo para almacenar Receptor de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionID'
  },
  billFechaEmision: {
    type: String,
    label:
      'Campo para almacenar Fecha Emisión de Factura Electrónica (de colección Factura Electrónica) (opcional)',
    fieldType: 'collectionFieldSelect',
    optional: true,
    parentCollection: 'billsCollectionID'
  },
  billFile: {
    type: String,
    label:
      'Campo para almacenar Archivo de la Factura (de colleción Factura Electrónica) (opcional)',
    optional: true,
    parentCollection: 'billsCollectionID'
  }
}
