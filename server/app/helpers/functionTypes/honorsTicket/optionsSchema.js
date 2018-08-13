export default {
  ticketsCollectionId: {
    label: 'Colección Boletas de Honorarios',
    type: String,
    fieldType: 'collectionSelect'
  },
  ticketDateField: {
    type: String,
    label: 'Fecha (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketRetentionField: {
    type: String,
    label: 'Retención (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketReceptorIdField: {
    type: String,
    label: 'Identificador Cliente (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketProductsIdsField: {
    type: String,
    label: 'Identificador Producto (desde formulario)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  clientsCollectionId: {
    type: String,
    label: 'Colección de Clientes',
    fieldType: 'collectionSelect'
  },
  receptorRutField: {
    type: String,
    label: 'Campo RUT Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorRsField: {
    type: String,
    label: 'Campo Razón Social Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorComunaField: {
    type: String,
    label: 'Campo Comuna Cliente (de colección Cliente)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'clientsCollectionId'
  },
  receptorDirectionField: {
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
  productsNameField: {
    type: String,
    label: 'Campo Nombre Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  productsPriceField: {
    type: String,
    label: 'Campo Precio Productos (de colección Productos)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'productsCollectionId'
  },
  ticketPDFField: {
    type: String,
    label: 'Campo para almacenar PDF de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketIDField: {
    type: String,
    label: 'Campo para almacenar ID de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketFolioField: {
    type: String,
    label: 'Campo para almacenar folio de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketTotalHonorarioField: {
    type: String,
    label: 'Campo para almacenar el total de honorario de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketTotalRetencionField: {
    type: String,
    label: 'Campo para almacenar el total de retención de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketTotalPagoField: {
    type: String,
    label: 'Campo para almacenar el total de pago de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  },
  ticketBarCodeField: {
    type: String,
    label: 'Campo para almacenar Código de barras de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId'
  }
}
