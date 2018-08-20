export default {
  paymentsCollectionId: {
    label: 'Colección',
    type: String,
    fieldType: 'collectionSelect'
  },
  // itemId: {
  //   type: String,
  //   label: 'Id del item'
  // },
  paymentReceptorIdField: {
    type: String,
    label: 'Campo Cliente',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'paymentsCollectionId'
  },
  paymentField: {
    type: String,
    label: 'Campo Monto',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'paymentsCollectionId'
  },
  paymentRetentionField: {
    type: String,
    label: 'Campo Retención',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'paymentsCollectionId'
  },
  paymentDetailNameField: {
    type: String,
    label: 'Campo Nombre Detalle',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'paymentsCollectionId'
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
  ticketsCollectionId: {
    label: 'Colección para guardar Boleta (opcional)',
    type: String,
    fieldType: 'collectionSelect'
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
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketTotalHonorarioField: {
    type: String,
    label: 'Campo para almacenar el total de honorario de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketTotalRetencionField: {
    type: String,
    label: 'Campo para almacenar el total de retención de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketTotalPagoField: {
    type: String,
    label: 'Campo para almacenar el total de pago de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  },
  ticketBarCodeField: {
    type: String,
    label: 'Campo para almacenar Código de barras de boleta (de colección Boletas) (opcional)',
    fieldType: 'collectionFieldSelect',
    parentCollection: 'ticketsCollectionId',
    optional: true
  }
}
