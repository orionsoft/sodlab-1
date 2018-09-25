export default {
  name: 'Barra: Contar por Fecha',
  chartType: 'bar',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    dateKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    filterId: {
      type: String,
      optional: true,
      label: 'Filtro',
      fieldType: 'filterSelect'
    }
  }
}
